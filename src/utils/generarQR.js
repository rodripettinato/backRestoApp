const QRCode = require('qrcode');

async function generarQR(restauranteId, numeroMesa) {
  const url = `${process.env.CLIENT}/carta/${restauranteId}/${numeroMesa}`;
  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    await QRCode.toFile(`public/img/restaurantes/mesas/${uniqueSuffix}.png`, url);
    console.log(`QR generado para Mesa ${numeroMesa}`);
    return uniqueSuffix + ".png"
  } catch (err) {
    console.error("Error generando el QR", err);
  }
}
module.exports = generarQR;
