const { createServer } = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
const mysql = require("mysql");
const { start } = require("repl");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "rtinteligence",
// });

const connection = mysql.createConnection({
  host: "intelligence.crc0m61eeiss.us-east-1.rds.amazonaws.com",
  user: "intelligenceAdm",
  password: "intelligence147258369",
  database: "rtinteligence",
});

connection.connect((error) => {
  if (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
  } else {
    console.log("Conexão estabelecida com sucesso!");
  }
});

let rooms = [];

function checkRoom() {
  let choosenRoom = null;
  rooms.forEach((element) => {
    if (element.usersCount < 3) {
      choosenRoom = element;
      return;
    }
  });

  if (choosenRoom !== null) {
    return choosenRoom;
  } else {
    return createRoom(8);
  }
}

function createRoom(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const newRoom = {
    name: result,
    usersCount: 0,
  };

  rooms.push(newRoom);

  return newRoom;
}

function createCallOnBD(roomObject) {
  // Insere os dados na tabela

  let newData = {
    name: roomObject.name,
    usersOnline: roomObject.usersCount,
    id_user_one: roomObject.id_list[0],
    id_user_two: roomObject.id_list[1],
    id_user_three: roomObject.id_list[2],
  };

  connection.query(
    "INSERT INTO api_channels SET ?",
    newData,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao inserir dados:", error.message);
      } else {
        console.log("Dados inseridos com sucesso!");
        rooms = rooms.filter((obj) => obj.name !== roomObject.name);
        console.log(rooms, "final rooms");
      }
    }
  );
}

io.on("connection", (socket) => {
  let roomChannelName;
  let beyondLimitCountDown;
  let position;
  let user_id;
  let callEndHour;
  let roomCountDown;

  function waitingInQueue(room) {
    const timer = position === "first" ? 60000 : 80000;
    beyondLimitCountDown = setTimeout(function () {
      searchCallWithThree(room);
    }, timer);
    console.log("ativou o countdown");
  }

  function clearTimeoutBeyond() {
    clearTimeout(beyondLimitCountDown);
    console.log("resetou o countdown");
  }

  function startRoomCountDown() {
    roomCountDown = setTimeout(function () {
      deleteRoom();
    }, 90000);
    console.log("começou o countdown da sala");
  }

  socket.on("newLogin", (arg) => {
    //contagem de users online
    const count = io.engine.clientsCount;
    console.log("emitiu novo login", count);
    io.emit("usersOnlineCountChange", count);
  });

  socket.on("startNewCallSearch", (arg) => {
    //começa a busca de uma nova call, entra em uma room se existir ou cria uma caso não.
    console.log("chegou uma newcall", arg);
    const id_user = arg;
    user_id = id_user;
    const room = checkRoom();
    console.log(room);
    const roomName = room.name;
    roomChannelName = roomName;
    const usersCount = room.usersCount;

    const index = rooms.findIndex((room) => room.name === roomName);

    socket.join(room.name);

    if (usersCount === 0) {
      io.to(room.name).emit("message", {
        channelName: roomName,
        status: "WAITING_MORE_USERS",
        usersCount: usersCount + 1,
        info: "Caso você não seja conectado a um canal com 3 usuários em 3 minutos, você será somado a um canal já preenchido.",
      });
      if (index !== -1) {
        rooms[index] = {
          ...rooms[index],
          usersCount: usersCount + 1,
          id_list: [id_user],
        };
      }
      position = "first";
      console.log(rooms[0], "rooms primeiro");

      waitingInQueue(rooms[index]);
    } else if (usersCount === 1) {
      io.to(room.name).emit("message", {
        channelName: roomName,
        status: "WAITING_MORE_USERS",
        usersCount: usersCount + 1,
        info: "Caso você não seja conectado a um canal com 3 usuários em 3 minutos, você será somado a um canal já preenchido.",
      });

      if (index !== -1) {
        rooms[index] = {
          ...rooms[index],
          usersCount: usersCount + 1,
        };

        rooms[index].id_list.push(id_user);
      }

      console.log(rooms, "second user rooms");

      position = "second";
    } else if (usersCount === 2) {
      io.to(room.name).emit("message", {
        channelName: roomName,
        status: "CALL_START",
        usersCount: usersCount + 1,
      });

      if (index !== -1) {
        rooms[index] = {
          ...rooms[index],
          usersCount: usersCount + 1,
        };

        rooms[index].id_list.push(id_user);
      }
      console.log(rooms);
      createCallOnBD(rooms[index]);
    }
  });

  socket.on("resetCountDown", () => {
    // reseta o countdown para entrar em um canal com 3 pessoas, acionado quando um segundo user
    // entra na fila
    clearTimeoutBeyond();

    const index = rooms.findIndex((room) => room.name === roomChannelName);

    waitingInQueue(rooms[index]);
  });

  socket.on("stopCountDown", (room) => {
    //acionada qnd os 3 users entram em call, para o countdown para entrar em um canal com 3 pessoas.
    clearTimeoutBeyond();
  });

  socket.on("cancelSearching", (arg) => {
    // cancela a busca e sai da room, acionada quando o user clica em voltar na tela de video call ou clica
    // em cancelar
    console.log("cancelar");
    const user_id = arg;
    console.log(rooms);
    const index = rooms.findIndex((room) => room.name === roomChannelName);

    if (index !== -1) {
      rooms[index] = {
        ...rooms[index],
        usersCount: rooms[index].usersCount - 1,
      };

      const filter = rooms[index].id_list.filter((id) => id !== user_id);
      rooms[index].id_list = filter;
      socket.leave(roomChannelName);
      console.log("filtrou os ids", rooms);
      clearTimeoutBeyond();
    }
  });

  socket.on("callReconnect", (arg) => {
    const obj = arg;
    roomChannelName = obj.name;
    socket.join(obj.name);
    socket.emit("message", {
      channelName: obj.name,
      status: "CALL_START",
      usersCount: obj.usersOnline,
    });
    console.log(obj, "obj reconnect");
    connection.query(
      "UPDATE api_channels SET usersOnline = ? WHERE name = ?",
      [obj.usersOnline + 1, obj.name],
      (error, results, fields) => {
        if (error) {
          console.error("Erro ao executar a atualização:", error.message);
        } else {
          console.log("Atualização realizada com sucesso!");
        }
      }
    );
  });

  socket.on("checkTimer", () => {
    if (!roomCountDown) {
      startRoomCountDown();
    } else {
      clearTimeout(roomCountDown);
      console.log("limpou o delete room");
    }

    if (callEndHour) {
      const newDate = new Date();
      const hours = newDate.getHours();
      const minutes = newDate.getMinutes();
      if (hours === callEndHour.hourEnd) {
        const diff = callEndHour.minuteEnd - minutes;
        if (diff === 3) {
          io.to(roomChannelName).emit("warn", {
            status: "COUNTDOWN",
            timeleft: 3,
          });
        } else if (diff === 2) {
          io.to(roomChannelName).emit("warn", {
            status: "COUNTDOWN",
            timeleft: 2,
          });
        } else if (diff === 1) {
          io.to(roomChannelName).emit("warn", {
            status: "COUNTDOWN",
            timeleft: 1,
          });
        } else if (diff <= 0) {
          io.to(roomChannelName).emit("warn", {
            status: "SHUTDOWN",
            timeleft: 1,
          });
          deleteRoom();
        }
      }
    } else {
      connection.query(
        "SELECT * FROM api_hoursControlls",
        (error, results, fields) => {
          if (error) {
            console.error("Erro ao encontrar dados:", error.message);
          } else {
            const result = results[0];
            console.log(result);
            callEndHour = {
              hourEnd: result.hourEnd,
              minuteEnd: result.minuteEnd,
            };
          }
        }
      );
    }
  });

  socket.on("disconnect", () => {
    const count = io.engine.clientsCount;
    io.emit("usersOnlineCountChange", count);
    console.log("usuario deslogou", count);
  });

  function searchCallWithThree() {
    rooms = rooms.filter((obj) => obj.name !== roomChannelName);
    socket.leave(roomChannelName);
    console.log(rooms);

    connection.query(
      "SELECT * FROM api_channels WHERE usersOnline <= 3 AND status <> 'full'",
      (error, results, fields) => {
        if (error) {
          console.error("Erro ao encontrar dados:", error.message);
        } else {
          const result = results[0];
          console.log(result);
          if (result) {
            socket.join(result.name);
            socket.emit("message", {
              channelName: result.name,
              status: "CALL_START",
              usersCount: result.usersOnline + 1,
            });
            connection.query(
              "UPDATE api_channels SET usersOnline = ?, status = 'full', id_user_fourth = ? WHERE id = ?",
              [result.usersOnline + 1, user_id, result.id],
              (error, results, fields) => {
                if (error) {
                  console.error(
                    "Erro ao executar a atualização:",
                    error.message
                  );
                } else {
                  console.log("Atualização realizada com sucesso!");
                }
              }
            );
          } else {
            socket.emit("message", {
              status: "WAITING",
            });
          }
        }
      }
    );
  }

  function deleteRoom() {
    connection.query(
      "DELETE FROM api_channels WHERE name = ?",
      [roomChannelName],
      (error, results, fields) => {
        if (error) {
          console.error("Erro ao executar a exclusão:", error.message);
        } else {
          console.log("Exclusão realizada com sucesso!");
        }
      }
    );
  }
});

httpServer.listen(8080);
