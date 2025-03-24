const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller");

router.post("/upload", ProductController.uploadImage);
router.get("/restaurante/:idRestaurante", ProductController.getProducts);
router.get("/restaurante/:idRestaurante/disponibles", ProductController.getProductsAvailable);
router.get("/:id", ProductController.getProductById);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
