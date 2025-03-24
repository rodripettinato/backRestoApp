const multer = require("multer");
const path = require("path");
const ProductModel = require("../models/product.model");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "..", "..", "public", "img", "restaurantes", "productos");
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage });

class ProductController {

    uploadImage(req, res) {
        upload.single("foto")(req, res, (err) => {
            if (err) {
              return res.status(500).json({ error: "Error al subir la imagen" });
            }
            if (req.file) {
              res.json({ imageUrl: `/img/restaurantes/productos/${req.file.filename}` });
            } else {
              res.status(400).json({ error: "No se seleccionó una imagen" });
            }
        });
    }

    async getProducts(req, res) {
        try {
            const productos = await ProductModel.getAll(req.params.idRestaurante);
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener productos" });
        }
    }

    async getProductsAvailable(req, res) {
        try {
            const productos = await ProductModel.getAllAvailable(req.params.idRestaurante);
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener productos" });
        }
    }

    async getProductById(req, res) {
        try {
            const productos = await ProductModel.getById(req.params.id);
            if (!productos) return res.status(404).json({ error: "No encontrado" });
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener producto" });
        }
    }

    async getProductByIdInterno(idRestaurante) {
        try {
            const producto = await ProductModel.getById(idRestaurante);
            return producto;
        } catch (error) {
            throw new Error("Error al obtener producto");
        }
    }

    async createProduct(req, res) {
        try {
            const nuevoProducto = await ProductModel.create(req.body);
            res.json(nuevoProducto);
        } catch (error) {
            res.status(500).json({ error: "Error al crear producto" });
        }
    }

    async updateProduct(req, res) {
        try {
            const productoActualizado = await ProductModel.update(req.params.id, req.body);
            res.json(productoActualizado);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar producto" });
        }
    }

    async deleteProduct(req, res) {
        try {
            await ProductModel.delete(req.params.id);
            res.json({ message: "Producto eliminado" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar producto" });
        }
    }
}

module.exports = new ProductController();