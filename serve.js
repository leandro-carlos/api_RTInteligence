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
  // if (hours !== 9 || minutes > 20) {
  //   ws.close();
  // }

  // client conectado com o websocket

  //id recebido do client pela url

  ws.on("message", function message(data) {
    const obj = JSON.parse(data);
    const type = obj.type;
    // obj com o type de conexão recebida

    switch (type) {
      case "connect":
        saveId(obj.id);
        createOrJoin();
        break;

      case "cancel":
        leave();
        break;
      default:
        console.warn(`Type: ${type} unknown`);
        break;
    }
  });

  function saveId(id) {
    if (ws.uid) {
      return;
    }
    ws.uid = id;
    console.log("id saved", id);
  }

  function createOrJoin() {
    //verifica se não existe nenhuma room e então cria uma.
    console.log(" algum user entrou aqui");
    const keys = Object.keys(rooms);
    const length = keys.length;
    console.log(length);

    if (length === 0) {
      return create();
    }

    // Verifica se o usuario já estava conectado em alguma room pelo id.
    const check = checkReconnect(keys, length);
    if (check.status === true) {
      return joinReconnect(check.room);
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

  function send(obj) {
    if (ws.OPEN) {
      const stringify = JSON.stringify(obj);
      console.log(stringify);
      return ws.send(stringify);
    } else {
      console.log("nenhuma conexão");
    }
  }

  function create() {
    console.log("entrou create");
    //cria uma sala com um nome gerado aleatoriamente
    const room = genKey(8);
    rooms[room] = [ws];
    ws["room"] = room;

    // envia um objeto com o status para mudar a section no front
    const obj = {
      status: "WAITING_MORE_USERS",
      usersCount: 1,
    };

    ws.send(JSON.stringify(obj));
  }

  function checkReconnect(keys, length) {
    console.log("reconect");
    // checa se o id do user já tinha sido atribuida a alguma sala e reconecta
    for (let i = 0; i < length; i++) {
      let namesRooms = rooms[keys[i]];
      if (namesRooms.length !== 0) {
        for (let a = 0; a < length; a++) {
          let target = namesRooms[a];
          // condição necessario pois a função de leave / cancel deixa uma propriedade com array vazio
          if (target.uid === ws.uid) {
            return {
              status: true,
              room: target.room,
            };
          }
        }
      }
    }
    return {
      status: false,
    };
  }

  function joinReconnect(roomName) {
    // reconecta em uma sala já existente, não valida o tamanho maximo
    const room = roomName;
    if (!Object.keys(rooms).includes(room)) {
      console.warn(`Room ${room} does not exist!`);
      createOrJoin();
      return;
    }

    // retorna call start para iniciar a video chamada no front

    rooms[room].push(ws);
    ws["room"] = room;
    const obj = {
      status: "CALL_START_RECONNECT",
      channel: roomName,
    };
    send(obj);
  }

  function join(roomName) {
    console.log("join");
    // entra em uma sala caso não esteja cheia
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
      // se for a ultima pessoa a entrar emite o call start para todos os integrantes da room
      rooms[room].push(ws);
      ws["room"] = room;
      obj = {
        status: "CALL_START",
        usersCount: 3,
        channel: roomName,
      };
      return wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && ws["room"] == roomName) {
          client.send(JSON.stringify(obj));
        }
      });
    }

    // se for a segunda pessoa a entrar, emite uma função para ele e o outro user,
    // feedback que uma segunda pessoa foi encontrada.
    if (rooms[room].length > 0) {
      rooms[room].push(ws);
      ws["room"] = room;
      obj = {
        status: "WAITING_MORE_USERS",
        usersCount: 2,
      };
      return wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && ws["room"] == roomName) {
          client.send(JSON.stringify(obj));
        }
      });
    }
    if (rooms[room].length === 0) {
      rooms[room].push(ws);
      ws["room"] = room;
      obj = {
        status: "WAITING_MORE_USERS",
        usersCount: 1,
      };
      send(obj);
    }
  }

  function leave() {
    if (ws.room) {
      const room = ws.room;
      rooms[room] = rooms[room].filter((so) => so !== ws);
      ws["room"] = undefined;
      console.log("leave");
    }
  }

  ws.on("close", () => {
    if (ws) {
      ws.close();
      console.log("Conexão encerrada");
    }
  });
  ws.on("error", (e) => {
    console.log(e);
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
