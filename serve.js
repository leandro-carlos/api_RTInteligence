const app = require("./src/app.js");
const http = require("http");
const WebSocket = require("ws");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const url = require("url");

const port = 8080;

const maxClients = 3;
let rooms = {};

wss.on("connection", function connection(ws, req) {
  const parameters = url.parse(req.url, true);
  ws.uid = parameters.query.myCustomID;

  ws.on("message", function message(data) {
    const obj = JSON.parse(data);
    const type = obj.type;
    const params = obj.params;

    switch (type) {
      case "connect":
        createOrJoin();
        break;
      case "reconnect":
        reconnect(params);
        break;

      default:
        console.warn(`Type: ${type} unknown`);
        break;
    }
  });

  function createOrJoin() {
    const keys = Object.keys(rooms);
    const length = keys.length;
    if (length === 0) {
      return create();
    }

    // checkReconnect(length);

    for (let i = 0; i < length; i++) {
      if (rooms[keys[i]].length < maxClients) {
        return join(keys[i]);
      }
    }

    return create();
  }

  function reconnect(roomName) {
    join(roomName);
  }

  function create() {
    const room = genKey(8);
    rooms[room] = [ws];
    ws["room"] = room;

    generalInformation(ws);
  }

  function join(roomName) {
    const room = roomName;
    if (!Object.keys(rooms).includes(room)) {
      console.warn(`Room ${room} does not exist!`);
      createOrJoin();
      return;
    }

    if (rooms[room].length >= maxClients) {
      console.warn(`Room ${room} is full!`);
      createOrJoin();
      return;
    }

    if (rooms[room].length >= maxClients - 1) {
      rooms[room].push(ws);
      ws["room"] = room;
      const obj = {
        status: true,
        channelName: roomName,
      };
      return wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && ws["room"] == roomName) {
          client.send(JSON.stringify(obj));
        }
      });
    }

    rooms[room].push(ws);
    ws["room"] = room;

    generalInformation(ws);
  }

  function leave(params) {
    const room = ws.room;
    rooms[room] = rooms[room].filter((so) => so !== ws);
    ws["room"] = undefined;

    if (rooms[room].length == 0) close(room);
  }
});

function close(room) {
  rooms = rooms.filter((key) => key !== room);
}

function genKey(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generalInformation(ws) {
  let obj;
  if (ws["room"] === undefined)
    obj = {
      type: "info",
      params: {
        room: ws["room"],
        "no-clients": rooms[ws["room"]].length,
      },
    };
  else
    obj = {
      type: "info",
      params: {
        room: "no room",
      },
    };

  ws.send(JSON.stringify(obj));
}

server.listen(process.env.port || port, () => {
  console.log(`backend rodando na porta ${port}`);
});
