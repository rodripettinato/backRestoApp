const express = require("express");
const router = express.Router();
const VentaController = require("../controllers/venta.controller");

router.get("/:idRestaurante", VentaController.obtenerEstadisticas);
router.get("/detalle_venta/:idVenta", VentaController.getDetalleVenta);
router.get("/historial_precio/:idProducto", VentaController.getHistorialPrecios);
router.get("/realtime/:idRestaurante", VentaController.getVentasNoFinished);
router.patch("/cambiar_estado/:id", VentaController.actualizarEstadoVenta);

module.exports = router;
