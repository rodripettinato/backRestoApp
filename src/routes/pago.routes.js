const express = require("express");
const { crearPreferencia } = require("../controllers/pago.controller");

const router = express.Router();

router.post("/crear-preferencia", crearPreferencia);

module.exports = router;
