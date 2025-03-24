const VentaModel = require("../models/venta.model");
const DetalleVentaModel = require("../models/detalleVenta.model");
const ProductController = require("../controllers/product.controller");

class VentaController {

  async crearVenta(data) {
    try {
      const venta = await VentaModel.crearVenta(data);
      return venta;
    } catch (error) {
      console.error("Error creando venta:", error);
      return { error: "Error creando venta:" };
    }
  }

  async crearDetalleVenta(data) {
    try {
      const detalleVenta = await DetalleVentaModel.crearDetalleVenta(data);
      return detalleVenta;
    } catch (error) {
      console.error("Error creando detalle venta:", error);
      return { error: "Error creando detalle venta:" };
    }
  }

  async obtenerEstadisticas(req, res) {
    try {
      const ventasPorMes = await VentaModel.obtenerVentasPorMesRestaurante(req.params.idRestaurante);
      const mesasPorVentas = await VentaModel.obtenerMesaMasVentasRestaurante(req.params.idRestaurante);
      const productoMasVendido = await DetalleVentaModel.obtenerProductoMasVendido(req.params.idRestaurante);
      const productoMenosVendido = await DetalleVentaModel.obtenerProductoMenosVendido(req.params.idRestaurante);
      let productoMostSelling = null;
      let productoLessSelling = null;

      if (productoMasVendido.length > 0) {
        productoMostSelling = await ProductController.getProductByIdInterno(productoMasVendido[0].producto_id);
      }      
      if (productoMenosVendido.length > 0) {
        productoLessSelling = await ProductController.getProductByIdInterno(productoMenosVendido[0].producto_id);
      }

      res.json({
        ventasPorMes: ventasPorMes.map((v) => ({
          fecha: v.fecha,
          monto: v._sum.monto,
        })),
        rankingMesas: mesasPorVentas,
        productoMasVendido: productoMostSelling,
        productoMenosVendido: productoLessSelling
      });
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      res.status(500).json({ error: "Error obteniendo estadísticas" });
    }
  }

  async getHistorialPrecios(req, res) {
    try {
      const historial = await DetalleVentaModel.obtenerHistorialPrecios(req.params.idProducto);
      res.json(historial);
    } catch (error) {
      console.error("Error obteniendo historial de precios:", error);
      res.status(500).json({ error: "Error obteniendo historial de precios" });
    }
  }

  async getVentasNoFinished(req, res) {
    try {
      const ventas = await VentaModel.getVentasNoFinished(req.params.idRestaurante);
      res.json(ventas);
    } catch (error) {
      console.error("Error obteniendo ventas no finalizadas:", error);
      res.status(500).json({ error: "Error obteniendo ventas no finalizadas:" });
    }
  }

  async actualizarEstadoVenta(req, res) {
    const { id } = req.params;
    const { estado } = req.body;
    const io = req.app.get("io");

    try {
      const ventaActualizada = await VentaModel.actualizarEstado(id, estado);

      io.emit("actualizar_pedido", { id, estado });

      res.json({ mensaje: "Estado actualizado", venta: ventaActualizada });
    } catch (error) {
      console.error("Error al actualizar estado de la venta:", error);
      res.status(500).json({ error: "No se pudo actualizar el estado" });
    }
  }

  async getDetalleVenta(req, res) {
    try {
      const venta = await DetalleVentaModel.obtenerDetalleVenta(req.params.idVenta);
      res.json(venta);
    } catch (error) {
      console.error("Error obteniendo venta:", error);
      res.status(500).json({ error: "Error obteniendo venta:" });
    }
  }

}

module.exports = new VentaController();