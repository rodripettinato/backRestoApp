const multer = require("multer");
const path = require("path");
const MesaModel = require("../models/mesa.model");
const generarQR = require("../utils/generarQR");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "..", "public", "img", "restaurantes");
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage });

class MesaController {
    constructor() {
        this.createMesa = this.createMesa.bind(this);
        this.updateMesaInterno = this.updateMesaInterno.bind(this);
        this.updateMesa = this.updateMesa.bind(this);
    }

    uploadImage(req, res) {
        upload.single("foto")(req, res, (err) => {
            if (err) {
              return res.status(500).json({ error: "Error al subir la imagen" });
            }
            if (req.file) {
              res.json({ imageUrl: `/img/restaurantes/${req.file.filename}` });
            } else {
              res.status(400).json({ error: "No se seleccionó una imagen" });
            }
        });
    }

    async getMesas(req, res) {
        try {
            const mesas = await MesaModel.getAll(req.params.idRestaurante);
            res.json(mesas);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener mesas" });
        }
    }

    async getMesaById(req, res) {
        try {
            const mesa = await MesaModel.getById(req.params.id);
            if (!mesa) return res.status(404).json({ error: "No encontrado" });
            res.json(mesa);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener mesa" });
        }
    }

    async getMesaByNumber(req, res) {
        try {
            const mesa = await MesaModel.getByNumber(req.params.idRestaurante, req.params.numeroMesa);
            if (!mesa) return res.status(404).json({ error: "No encontrado" });
            res.json(mesa);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener mesa" });
        }
    }

    async createMesa(req, res) {
        try {
            const nuevaMesa = await MesaModel.create(req.body);
            const urlQR = await generarQR(req.body.id_restaurante, req.body.numero_mesa);
            nuevaMesa.qr = `img/restaurantes/mesas/${urlQR}`;
            const mesaActualizada = await this.updateMesaInterno(nuevaMesa.id, nuevaMesa);
            res.json(mesaActualizada);
        } catch (error) {
            res.status(500).json({ error: "Error al crear mesa" });
        }
    }
    
    async updateMesaInterno(id, data) {
        try {
            const mesaActualizada = await MesaModel.update(id, data);
            return mesaActualizada;
        } catch (error) {
            throw new Error("Error al actualizar mesa");
        }
    }

    async updateMesa(req, res) {
        try {
            const mesaActualizado = await MesaModel.update(req.params.id, req.body);
            const urlQR = await generarQR(req.body.id_restaurante, req.body.numero_mesa);
            mesaActualizado.qr = `img/restaurantes/mesas/${urlQR}`;
            const mesaActualizada = await this.updateMesaInterno(mesaActualizado.id, mesaActualizado);
            res.json(mesaActualizada);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar mesa" });
        }
    }

    async deleteMesa(req, res) {
        try {
            await MesaModel.delete(req.params.id);
            res.json({ message: "Mesa eliminada" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar mesa" });
        }
    }
}

module.exports = new MesaController();
