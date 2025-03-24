const express = require("express");
const router = express.Router();
const MesaController = require("../controllers/mesa.controller");

router.get("/restaurante/:idRestaurante", MesaController.getMesas);
router.get("/:id", MesaController.getMesaById);
router.get("/numero/:idRestaurante/:numeroMesa", MesaController.getMesaByNumber);
router.post("/", MesaController.createMesa);
router.put("/:id", MesaController.updateMesa);
router.delete("/:id", MesaController.deleteMesa);

module.exports = router;
