const express = require("express");
const router = express.Router();
const RestauranteController = require("../controllers/restaurante.controller");

router.get("/", RestauranteController.getRestaurantes);
router.post("/upload", RestauranteController.uploadImage);
router.get("/owner/:id", RestauranteController.getRestaurantesByOwner);
router.get("/:id", RestauranteController.getRestauranteById);
router.post("/", RestauranteController.createRestaurante);
router.put("/:id", RestauranteController.updateRestaurante);
router.delete("/:id", RestauranteController.deleteRestaurante);

module.exports = router;
