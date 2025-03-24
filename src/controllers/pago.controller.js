const { Preference } = require('mercadopago');
const mpc = require('../config/mercadopago');

exports.crearPreferencia = async (req, res) => {
  const { carrito, idOrder, nombre, apellido, dni , telefono, restauranteID, mesaID} = req.body;

  const items = carrito.map((producto) => ({
    id: producto.id,
    category_id: producto.categoria_id,
    description: producto.descripcion,
    picture_url: `${process.env.BACKEND_URL}${producto.foto}`,
    title: producto.nombre,
    unit_price: producto.precio,
    quantity: producto.cantidad,
    currency_id: 'ARS',
  }));

  try {
    const body = {
      items,
      payer: {
        name: nombre,
        surname: apellido,
        phone: {
          number: telefono
        },
        identification: {
          type: "DNI",
          number: dni
        }
      },
      back_urls: {
        success: `${process.env.CLIENT}/pedido/`,
        failure: `${process.env.CLIENT}/pago_erroneo/fallido`,
        pending: `${process.env.CLIENT}/pago_erroneo/pendiente`,
      },
      external_reference: `${restauranteID}/${mesaID}`,
      auto_return: 'approved',
      notification_url: `${process.env.CLIENT}/api/payments/notification`,
      payment_methods: {
        excluded_payment_types: [{ id: "ticket" }],
      }
    };
    
    const preference = await new Preference(mpc).create({ body });

    //res.json({ redirectUrl: preference.sandbox_init_point });
    res.json({ redirectUrl: preference.init_point });
  } catch (error) {
    console.error('Error al crear la preferencia de pago:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
};
