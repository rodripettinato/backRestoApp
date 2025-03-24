const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const VentaController = require("../controllers/venta.controller");

const MERCADOPAGO_ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const processPayment = async (merchantOrderId) => {
  try {
    const existingSale = await prisma.ventas.findUnique({
      where: { merchantOrderId },
    });

    if (existingSale) {
      console.log("Esta venta ya fue procesada.");
      return existingSale;
    }

    const { data: merchantOrder } = await axios.get(
      `https://api.mercadolibre.com/merchant_orders/${merchantOrderId}`,
      { headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` } }
    );

    console.log("Merchant Order:", merchantOrder);

    const isPaid = merchantOrder.payments.some((p) => p.status === "approved");
    if (!isPaid) throw new Error("El pago aún no está aprobado.");

    console.log("Pago aprobado:", isPaid);

    const preferenceId = merchantOrder.preference_id;
    const { data: preference } = await axios.get(
      `https://api.mercadopago.com/checkout/preferences/${preferenceId}`,
      { headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` } }
    );

    console.log("Preference Data:", preference);

    const payer = preference.payer || {};
    const nombre = payer.name || "Desconocido";
    const apellido = payer.surname || "Desconocido";
    const telefono = payer.phone.number || "No especificado";
    const dni = payer.identification.number || "No especificado";

    const external_reference = preference.external_reference;
    const [restauranteID, mesaID] = external_reference.split("/");
    const ventaData = {
      comprador_nombre: nombre,
      comprador_apellido: apellido,
      comprador_telefono: telefono,
      dni_comprador: Number(dni),
      id_mesa: Number(mesaID),
      id_restaurante: Number(restauranteID),
      estado: "Pagado",
      merchantOrderId: merchantOrderId,
      preferenceID: preferenceId,
      metodo_de_pago: "MercadoPago",
      monto: merchantOrder.total_amount,
      fecha: new Date(),
    }
    const venta = await VentaController.crearVenta(ventaData);

    console.log("Venta registrada:", venta);

    const detalleVentaData = merchantOrder.items.map(item => ({
      venta_id: venta.id,
      producto_id: Number(item.id),
      id_restaurante: Number(restauranteID),
      cantidad: item.quantity,
      precio_unitario: item.unit_price,
    }));

    const detalleVenta = await VentaController.crearDetalleVenta(detalleVentaData);

    console.log("Detalles de la venta registrados:", detalleVenta);

    return detalleVenta;
  } catch (error) {
    console.error("Error en el proceso de pago:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { processPayment };