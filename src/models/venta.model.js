const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class VentaModel {

  async crearVenta(data) {
    try {
      return await prisma.ventas.create({ data });
    } catch (error) {
      console.error("Error creando ventas", error);
      throw new Error("Error creando ventas");
    }
  }

  async obtenerVentasPorMesRestaurante(idRestaurante) {
    try {
      return await prisma.ventas.groupBy({
        by: ["fecha"],
        _sum: { monto: true },
        where: { id_restaurante: parseInt(idRestaurante) },
        orderBy: { fecha: "asc" },
      });
    } catch (error) {
      console.error("Error obteniendo ventas por mes:", error);
      throw new Error("Error obteniendo ventas por mes");
    }
  }

  async obtenerMesaMasVentasRestaurante(idRestaurante) {
    try {
      return await prisma.ventas.groupBy({
        by: ["id_mesa"],
        _sum: { monto: true },
        where: { id_restaurante: parseInt(idRestaurante) },
        orderBy: { _sum: { monto: "desc" } },
      });
    } catch (error) {
      console.error("Error obteniendo ranking de mesas:", error);
      throw new Error("Error obteniendo ranking de mesas");
    }
  }

  async getVentasNoFinished(idRestaurante) {
    try {
      return await prisma.ventas.findMany({
        where: {
          id_restaurante: parseInt(idRestaurante),
          estado: { not: "Finalizado" },
        },
        orderBy: { fecha: "desc" },
      });
    } catch (error) {
      console.error("Error obteniendo ventas no finalizadas:", error);
      throw new Error("Error obteniendo ventas no finalizadas");
    }
  }

  async actualizarEstado(id, nuevoEstado) {
    try {
      const ventaActualizada = await prisma.ventas.update({
        where: { merchantOrderId: id },
        data: { estado: nuevoEstado },
      });

      return ventaActualizada;
    } catch (error) {
      console.error("Error al actualizar el estado de la venta:", error);
      throw new Error("No se pudo actualizar el estado de la venta");
    }
  }
}

module.exports = new VentaModel();