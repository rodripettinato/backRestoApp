const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/auth.model");

class AuthController {
  async register(req, res) {
    try {
      const { usuario, nombre, dni, fecha_de_nacimiento, contraseña } = req.body;
      const existingUser = await UserModel.findUserByUsername(usuario);
      if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

      await UserModel.createUser(usuario, nombre, Number(dni), fecha_de_nacimiento, contraseña);
      res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Error al registrar usuario", error });
    }
  }

  async login(req, res) {
    try {
      const { usuario, contraseña } = req.body;

      const user = await UserModel.findUserByUsername(usuario);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
      if (!isValidPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign({ id: user.id, usuario: user.usuario }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ message: "Login exitoso", token: token,  usuario_id: user.id, userName: user.usuario });
    } catch (error) {
      res.status(500).json({ message: "Error en el login", error });
    }
  }
}

module.exports = new AuthController();
