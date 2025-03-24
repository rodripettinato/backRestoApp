const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ProductModel {
    async getAll(idRestaurante) {
        return await prisma.productos.findMany({
            where: { id_restaurante: parseInt(idRestaurante) },
        });
    }
    
    async getAllAvailable(idRestaurante) {
        return await prisma.productos.findMany({
            where: { id_restaurante: parseInt(idRestaurante), disponible: true },
        });
    }
    async getById(id) {
        return await prisma.productos.findUnique({
            where: { id: parseInt(id) },
        });
    }

    async create(data) {
        return await prisma.productos.create({ data });
    }

    async update(id, data) {
        return await prisma.productos.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    async delete(id) {
        return await prisma.productos.delete({
            where: { id: parseInt(id) },
        });
    }
}

module.exports = new ProductModel();