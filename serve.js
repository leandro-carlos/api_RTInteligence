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
  ws.send(ws.uid);

  ws.on("message", function message(data) {
    const obj = JSON.parse(data);
    const type = obj.type;
    const params = obj.params;

    switch (type) {
      case "create":
        create(params);
        break;
      case "join":
        join(params);
        break;
      case "leave":
        leave(params);
        break;
      default:
        console.warn(`Type: ${type} unknown`);
        break;
    }
  });

  function create(params) {
    const room = genKey(5);
    rooms[room] = [ws];
    ws["room"] = room;

    generalInformation(ws);
  }

  function join(params) {
    const room = params.code;
    if (!Object.keys(rooms).includes(room)) {
      console.warn(`Room ${room} does not exist!`);
      return;
    }

    if (rooms[room].length >= maxClients) {
      console.warn(`Room ${room} is full!`);
      return;
    }

    rooms[room].push(ws);
    ws["room"] = room;

    generalInformation(ws);
  }
  function leave(params) {}
});

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
