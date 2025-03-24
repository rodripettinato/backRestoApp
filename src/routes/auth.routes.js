const express = require("express");
const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/validate-token", authMiddleware, (req, res) => {
    res.status(200).json({ message: "Acceso autorizado", user: req.user });
  });

module.exports = router;
