const CategoryModel = require("../models/category.model");

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categorias = await CategoryModel.getAll(req.params.idRestaurante);
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener categorías" });
        }
    }

    async getCategoryById(req, res) {
        try {
            const categoria = await CategoryModel.getById(req.params.id);
            if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });
            res.json(categoria);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener categoría" });
        }
    }

    async createCategory(req, res) {
        try {
            const nuevaCategoria = await CategoryModel.create(req.body);

            res.json(nuevaCategoria);
        } catch (error) {
            res.status(500).json({ error: "Error al crear categoría" });
        }
    }

    async updateCategory(req, res) {
        try {
            const categoriaActualizada = await CategoryModel.update(req.params.id, req.body);
            res.json(categoriaActualizada);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar categoría" });
        }
    }

    async deleteCategory(req, res) {
        try {
            const categoriaConProductos = await CategoryModel.getByIdAndProducts(req.params.id);

            if (!categoriaConProductos) {
                return res.status(404).json({ error: "Categoría no encontrada" });
            }

            if (categoriaConProductos.productos.length > 0) {
                return res.status(400).json({ error: "No se puede eliminar la categoría porque está asociada a productos" });
            }

            await CategoryModel.delete(req.params.id);
            res.json({ message: "Categoría eliminada exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar categoría" });
        }
    }
}

module.exports = new CategoryController();
