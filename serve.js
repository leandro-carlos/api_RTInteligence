const { createServer } = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
const mysql = require("mysql");
const { create } = require("domain");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "rtinteligence",
});

// const connection = mysql.createConnection({
//   host: "intelligence.crc0m61eeiss.us-east-1.rds.amazonaws.com",
//   user: "intelligenceAdm",
//   password: "intelligence147258369",
//   database: "rtinteligence",
// });

connection.connect((error) => {
  if (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
  } else {
    console.log("Conexão estabelecida com sucesso!");
  }
});

let rooms = [];

function checkRoom() {
  rooms.forEach((element) => {
    if (element.usersCount < 3) {
      return element;
    }
  });

  createRoom(8);
}

function createRoom(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const newRoom = {
    name: result,
    usersCount: 1,
  };

  rooms.push(newRoom);

  return newRoom;
}

function createCallOnBD(newData) {
  // Insere os dados na tabela
  connection.query(
    "INSERT INTO api_channels SET ?",
    newData,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao inserir dados:", error.message);
      } else {
        console.log("Dados inseridos com sucesso!");
      }
    }
  );
}

io.on("connection", (socket) => {
  let beyondLimitCountDown;
  let roomChannelName;

  function waitingInQueue(room, position) {
    const timer = position === "first" ? 60000 : 80000;
    beyondLimitCountDown = setTimeout(function () {
      searchCallWithThree(room);
    }, timer);
  }

  function clearTimeoutBeyond() {
    clearTimeout(beyondLimitCountDown);
  }

  console.log("conectou um novo socket");

  socket.on("newLogin", (arg) => {
    const count = io.engine.clientsCount;
    console.log("emitiu novo login", count);
    socket.emit("usersOnlineCountChange", count);
  });

  socket.on("startNewCallSearch", (arg) => {
    console.log("chegou uma newcall", arg);
    const id_user = arg;

    const room = checkRoom();
    const roomName = room.name;
    roomChannelName = roomName;
    const usersCount = room.usersCount;
    const objetoEncontrado = rooms.find((room) => room.name === roomName);

    socket.join(room.name);

    if (room.usersCount === 1) {
      socket.to(room.name).emit("message", {
        channelName: roomName,
        status: "WAITING_MORE_USERS",
        usersCount: usersCount,
      });
      if (objetoEncontrado) {
        objetoEncontrado = {
          ...objetoEncontrado,
          id_user_one: id_user,
        };
      }
      waitingInQueue(objetoEncontrado, "first");
    } else {
      const newUsersCount = usersCount + 1;

      if (newUsersCount === 2) {
        socket.to(room.name).emit("message", {
          channelName: roomName,
          status: "WAITING_MORE_USERS",
          usersCount: usersCount,
        });
        if (objetoEncontrado) {
          objetoEncontrado = {
            ...objetoEncontrado,
            id_user_two: id_user,
          };
        }
      }
      if (newUsersCount === 3) {
        socket.to(room.name).emit("message", {
          channelName: roomName,
          status: "CALL_START",
          usersCount: usersCount,
        });

        objetoEncontrado = {
          ...objetoEncontrado,
          id_user_three: id_user,
        };

        createCallOnBD(objetoEncontrado);
      }
    }
  });

  socket.on("resetCountDown", (arg) => {
    const position = arg;
    clearTimeoutBeyond();

    const objetoEncontrado = rooms.find(
      (room) => room.name === roomChannelName
    );

    waitingInQueue(objetoEncontrado, position);
  });

  socket.on("stopCountDown", () => {
    clearTimeoutBeyond();
  });

  function searchCallWithThree(roomObject) {
    const index = rooms.indexOf(roomObject);
    const room = rooms[index];
    rooms = rooms.filter((obj) => obj.name !== room.name);
    socket.leave(roomChannelName);

    connection.query(
      "SELECT * FROM api_channels WHERE usersOnline = 3",
      (error, results, fields) => {
        if (error) {
          console.error("Erro ao inserir dados:", error.message);
        } else {
          const result = results[0];
        }
      }
    );
  }
});

httpServer.listen(8080);
