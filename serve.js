const app = require("./src/app.js");
const http = require("http");
const WebSocket = require("ws");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const url = require("url");

const port = 8080;

const maxClients = 3;
const newDate = new Date();
const hours = newDate.getHours();
const minutes = newDate.getMinutes();

let rooms = {};

wss.on("connection", function connection(ws, req) {
  if (hours !== 9 || minutes > 20) {
    ws.close();
  }

  // client conectado com o websocket
  const parameters = url.parse(req.url, true);
  ws.uid = parameters.query.myCustomID;
  //id recebido do client pela url

  ws.on("message", function message(data) {
    const obj = JSON.parse(data);
    const type = obj.type;
    // obj com o type de conexão recebida

    switch (type) {
      case "connect":
        createOrJoin();
        break;

      default:
        console.warn(`Type: ${type} unknown`);
        break;
    }
  });

  function createOrJoin() {
    //verifica se não existe nenhuma room e então cria uma.
    const keys = Object.keys(rooms);
    const length = keys.length;
    if (length === 0) {
      return create();
    }

    // Verifica se o usuario já estava conectado em alguma room pelo id.
    const check = checkReconnect(keys, length);
    if (check === true) {
      return joinReconnect(target.room);
    }

    // verifica se existe alguma sala com vagas disponiveis.
    for (let i = 0; i < length; i++) {
      if (rooms[keys[i]].length < maxClients) {
        return join(keys[i]);
      }
    }

    // se nenhum dos casos acima se realizar, cria uma sala.
    return create();
  }

  function create() {
    const room = genKey(8);
    rooms[room] = [ws];
    ws["room"] = room;

    const obj = {
      status: "WAITING_ALONE",
    };

    ws.send(JSON.stringify(obj));
  }

  function checkReconnect(keys, length) {
    for (let i = 0; i < length; i++) {
      let namesRooms = rooms[keys[i]];
      for (let a = 0; a < length; a++) {
        let target = namesRooms[a];
        if (target.uid === ws.uid) {
          return true;
        }
      }
    }
    return false;
  }

  function joinReconnect(roomName) {
    const room = roomName;
    if (!Object.keys(rooms).includes(room)) {
      console.warn(`Room ${room} does not exist!`);
      createOrJoin();
      return;
    }

    rooms[room].push(ws);
    ws["room"] = room;
    const obj = {
      status: "CALL_START",
      channelName: roomName,
    };
    ws.send(JSON.stringify(obj));
  }

  function join(roomName) {
    const room = roomName;
    let obj;
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

    if (rooms[room].length >= 2) {
      rooms[room].push(ws);
      ws["room"] = room;
      obj = {
        status: "CALL_START",
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
    obj = {
      status: "WAITING_WITH_USER",
    };
    return wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN && ws["room"] == roomName) {
        client.send(JSON.stringify(obj));
      }
    });
  }

  // function leave(params) {
  //   const room = ws.room;
  //   rooms[room] = rooms[room].filter((so) => so !== ws);
  //   ws["room"] = undefined;

  //   if (rooms[room].length == 0) close(room);
  // }
  ws.on("close", () => {
    console.log("Conexão encerrada");
  });
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

server.listen(process.env.port || port, () => {
  console.log(`backend rodando na porta ${port}`);
});
