const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CategoryModel {
    async getAll(idRestaurante) {
        return await prisma.categorias.findMany({
            where: { id_restaurante: parseInt(idRestaurante) },
        });
    }

    async getById(id) {
        return await prisma.categorias.findUnique({
            where: { id: parseInt(id) },
        });
    }

    async getByIdAndProducts(id) {
        return await prisma.categorias.findUnique({
            where: { id: parseInt(id) },
            include: { productos: true }, 
        });
    }

    async create(data) {
        return await prisma.categorias.create({ data });
    }

    async update(id, data) {
        return await prisma.categorias.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    async delete(id) {
        return await prisma.categorias.delete({
            where: { id: parseInt(id) },
        });
    }
}

module.exports = new CategoryModel();