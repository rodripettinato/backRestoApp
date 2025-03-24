const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

class AuthModel {
  async createUser(usuario, nombre, dni, fecha_de_nacimiento, contraseña) {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    return await prisma.usuario.create({
      data: {
        usuario,
        nombre,
        dni,
        fecha_de_nacimiento: new Date(fecha_de_nacimiento),
        contraseña: hashedPassword,
      },
    });
  }

  async findUserByUsername(usuario) {
    return await prisma.usuario.findUnique({ where: { usuario } });
  }
}

module.exports = new AuthModel();
