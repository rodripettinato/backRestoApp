const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DetalleVentaModel {

  async crearDetalleVenta(data) {
    try {
      return await prisma.detalleVenta.createMany({ data });
    } catch (error) {
      console.error("Error creando detalle ventas", error);
      throw new Error("Error creando detalle ventas");
    }
  }

   async obtenerProductoMasVendido(idRestaurante) {
    return await prisma.detalleVenta.groupBy({
      by: ["producto_id"],
      _sum: { cantidad: true },
      where: { id_restaurante: parseInt(idRestaurante) },
      orderBy: { _sum: { cantidad: "desc" } },
      take: 1,
    });
  }

  async obtenerProductoMenosVendido(idRestaurante) {
    return await prisma.detalleVenta.groupBy({
      by: ["producto_id"],
      _sum: { cantidad: true },
      where: { id_restaurante: parseInt(idRestaurante) },
      orderBy: { _sum: { cantidad: "asc" } }, 
      take: 1,
    });
  }
  
  async obtenerHistorialPrecios(idProducto) {
    return await prisma.detalleVenta.findMany({
      where: { producto_id: parseInt(idProducto) },
      select: {
        precio_unitario: true,
        fecha: true
      },
      orderBy: { fecha: "asc" }
    });
  }

  async obtenerDetalleVenta(idVenta) {
    return await prisma.ventas.findUnique({
      where: { merchantOrderId: idVenta },
      include: {
        mesa: true,
        detalleVentas: {
          include: {
            producto: true,
          },
        },
      },
    });
  }
}

module.exports = new DetalleVentaModel();