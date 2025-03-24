const multer = require("multer");
const path = require("path");
const RestauranteModel = require("../models/restaurante.model");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "..", "..", "public", "img", "restaurantes", "restaurantes");
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage });

class RestauranteController {

    uploadImage(req, res) {
        upload.single("foto")(req, res, (err) => {
            if (err) {
              return res.status(500).json({ error: "Error al subir la imagen" });
            }
            if (req.file) {
              res.json({ imageUrl: `/img/restaurantes/restaurantes/${req.file.filename}` });
            } else {
              res.status(400).json({ error: "No se seleccionó una imagen" });
            }
        });
    }

    async getRestaurantes(req, res) {
        try {
            const restaurantes = await RestauranteModel.getAll();
            res.json(restaurantes);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener restaurantes" });
        }
    }

    async getRestaurantesByOwner(req, res) {
        try {
            const restaurante = await RestauranteModel.getByOwner(req.params.id);
            if (!restaurante) return res.status(404).json({ error: "No encontrado" });
            res.json(restaurante);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener restaurante" });
        }
    }

    async getRestauranteById(req, res) {
        try {
            const restaurante = await RestauranteModel.getById(req.params.id);
            if (!restaurante) return res.status(404).json({ error: "No encontrado" });
            res.json(restaurante);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener restaurante" });
        }
    }

    async createRestaurante(req, res) {
        try {
            const nuevoRestaurante = await RestauranteModel.create(req.body);
            res.json(nuevoRestaurante);
        } catch (error) {
            res.status(500).json({ error: "Error al crear restaurante" });
        }
    }

    async updateRestaurante(req, res) {
        try {
            const restauranteActualizado = await RestauranteModel.update(req.params.id, req.body);
            res.json(restauranteActualizado);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar restaurante" });
        }
    }

    async deleteRestaurante(req, res) {
        try {
            await RestauranteModel.delete(req.params.id);
            res.json({ message: "Restaurante eliminado" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al eliminar restaurante" });
        }
    }
}

module.exports = new RestauranteController();