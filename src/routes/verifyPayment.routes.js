const express = require("express");
const paymentController = require("../controllers/verifyPayment.controller");

const router = express.Router();

router.post("/notification", paymentController.verifyPayment);

module.exports = router;
