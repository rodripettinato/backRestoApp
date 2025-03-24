const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MesaModel {
    async getAll(idRestaurante) {
        return await prisma.mesas.findMany({
            where: { id_restaurante: parseInt(idRestaurante) },
        });
    }
    
    async getById(id) {
        return await prisma.mesas.findUnique({
            where: { id: parseInt(id) },
        });
    }

    async getByNumber(idRestaurante, numeroMesa) {
        return await prisma.mesas.findFirst({
            where: { id_restaurante: parseInt(idRestaurante), numero_mesa: parseInt(numeroMesa) },
        });
    }

    async create(data) {
        return await prisma.mesas.create({ data });
    }

    async update(id, data) {
        return await prisma.mesas.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    async delete(id) {
        return await prisma.mesas.delete({
            where: { id: parseInt(id) },
        });
    }
}

module.exports = new MesaModel();