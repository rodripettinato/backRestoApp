const http = require("http");
const { Server } = require("socket.io");
const app = require("../app");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const mozoController = require("../controllers/mozo.controller");

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  
  mozoController.llamarMozo(io, socket)
  
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

module.exports = { server };
