class MozoController {
    async llamarMozo(io, socket) {
      try {  
        socket.on("llamar_mozo", (data) => {
        io.emit(`mozo_solicitado/${data.idRestaurante}`, data);
        });
      } catch (error) {
        console.error("Error al pedir mozo:", error);
      }
    }
  }
  
  module.exports = new MozoController();