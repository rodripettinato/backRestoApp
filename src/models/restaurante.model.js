const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class RestauranteModel {
    async getAll() {
        return await prisma.restaurante.findMany();
    }

    async getByOwner(idOwner) {
        return await prisma.restaurante.findMany({
            where: { usuario_id: parseInt(idOwner) },
        });
    }

    async getById(id) {
        return await prisma.restaurante.findUnique({
            where: { id: parseInt(id) },
        });
    }

    async create(data) {
        return await prisma.restaurante.create({ data });
    }

    async update(id, data) {
        return await prisma.restaurante.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    async delete(id) {
        return await prisma.restaurante.delete({
            where: { id: parseInt(id) },
        });
    }
}

module.exports = new RestauranteModel();