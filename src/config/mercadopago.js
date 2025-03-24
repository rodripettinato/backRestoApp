const { MercadoPagoConfig } = require('mercadopago');

const mpc = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });

module.exports = mpc;
