const paymentService = require("../services/paymentService");

const verifyPayment = async (req, res) => {
  try {

    const { resource, topic } = req.body;

    if (topic !== "merchant_order") {
      return res.status(400).json({ message: "Evento no relevante, ignorado." });
    }

    const merchantOrderId = resource.split("/").pop();

    const venta = await paymentService.processPayment(merchantOrderId);

    res.status(200).json({ message: "Pago verificado y registrado", venta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { verifyPayment };
