const app = require("./src/app.js");
const http = require("http");
const WebSocket = require("ws");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 8080;

const maxClients = 3;

const videoSchedule = {
  initialHour: 12,
  initialMinute: 20,
  finalHour: 13,
  finalMinute: 25,
};

let rooms = {};
let clients = [];

function resetRooms() {
  return (rooms = {});
}

wss.on("connection", function connection(ws, req) {
  // client conectado com o websocket

  let heartbeatTimer = null;
  const heartbeatInterval = 15000; // intervalo de heartbeat em milissegundos

  function startHeartbeatTimer() {
    heartbeatTimer = setTimeout(function () {
      close();
    }, heartbeatInterval * 3); // aguarda o dobro do intervalo de heartbeat antes de disparar o temporizador
  }

  ws.on("message", function message(data) {
    const obj = JSON.parse(data);
    const type = obj.type;
    // obj com o type de conexão recebida

    switch (type) {
      case "userOnline":
        saveId(obj.id);
        break;

      case "connect":
        createOrJoin();
        break;

      case "checkTimer":
        checkCountDown();
        break;

      case "heartbeat":
        checkHeartBeat();
        break;

      case "changeStatus":
        changeStatusToOnCall();
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

    clients.push(ws);

    let obj = {
      type: "user_online",
      totalUsersOnline: clients.length,
    };

    return wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(obj));
      }
    });
  }

  function changeStatusToOnCall() {
    ws.status = "onCall";
  }

  function createOrJoin() {
    let newDate = new Date();
    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();

    if (
      (hours === videoSchedule.initialHour &&
        minutes >= videoSchedule.initialMinute) ||
      (hours === videoSchedule.finalHour &&
        minutes <= videoSchedule.finalMinute)
    ) {
      let obj = {
        type: "message",
        status: "SHUTDOWN",
        hours: hours,
        minutes: minutes,
        initialHour: videoSchedule.initialHour,
        finalHour: videoSchedule.finalHour,
        initialMinute: videoSchedule.initialMinute,
        finalMinute: videoSchedule.finalMinute,
      };
      return send(obj);
    }

    //verifica se não existe nenhuma room e então cria uma.
    console.log(" create or join");
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
      type: "message",
    };

    ws.send(JSON.stringify(obj));
  }

  function checkReconnect(keys, length) {
    console.log("reconect");
    // checa se o id do user já tinha sido atribuida a alguma sala e reconecta
    for (let i = 0; i < length; i++) {
      let namesRooms = rooms[keys[i]];

      if (namesRooms.length !== 0) {
        for (let a = 0; a < namesRooms.length; a++) {
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

    ws["room"] = room;
    const obj = {
      status: "CALL_START_RECONNECT",
      channel: roomName,
      type: "message",
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
        type: "message",
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
        type: "message",
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
        type: "message",
      };
      send(obj);
    }
  }

  function checkCountDown() {
    let newDate = new Date();
    let minutes = newDate.getMinutes();
    if (minutes === videoSchedule.finalMinute - 3) {
      let obj = {
        type: "call_warn",
        status: "COUNTDOWN",
        timeleft: 3,
      };
      return send(obj);
    } else if (minutes === videoSchedule.finalMinute - 2) {
      let obj = {
        type: "call_warn",
        status: "COUNTDOWN",
        timeleft: 2,
      };
      return send(obj);
    } else if (minutes === videoSchedule.finalMinute - 1) {
      let obj = {
        type: "call_warn",
        status: "COUNTDOWN",
        timeleft: 1,
      };
      return send(obj);
    } else if (minutes >= videoSchedule.finalMinute) {
      let obj = {
        type: "call_warn",
        status: "SHUTDOWN",
        timeleft: 0,
      };
      resetRooms();
      return send(obj);
    }
  }

  function checkHeartBeat() {
    clearTimeout(heartbeatTimer);
    startHeartbeatTimer();
  }

  function leave() {
    if (ws.status === "onCall") {
      return;
    }
    if (ws.room && rooms.length !== 0) {
      const room = ws.room;
      rooms[room] = rooms[room].filter((so) => so !== ws);
      ws["room"] = undefined;
      ws.status = undefined;

      if (rooms[room].length !== 0) {
        obj = {
          status: "WAITING_MORE_USERS",
          usersCount: rooms[room].length,
          type: "message",
        };
        return wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN && ws["room"] == room) {
            client.send(JSON.stringify(obj));
          }
        });
      }
    }
  }

  ws.on("close", () => {
    close();
  });

  ws.on("error", (e) => {
    console.log(e);
  });

  function close() {
    try {
      clearTimeout(heartbeatTimer);
    } catch (error) {}

    if (ws) {
      if (ws.uid) {
        clients.splice(clients.indexOf(ws), 1);

        let obj = {
          type: "user_online",
          totalUsersOnline: clients.length,
        };

        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(obj));
          }
        });
      }
      ws.close();
    }
  }
});

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
