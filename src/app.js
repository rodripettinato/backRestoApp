const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const restauranteRoutes = require("./routes/restaurante.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const pagoRoutes = require("./routes/pago.routes");
const mesaRoutes = require("./routes/mesa.routes");
const authRoutes = require("./routes/auth.routes");
const ventaRoutes = require("./routes/venta.routes");
const paymentRoutes = require("./routes/verifyPayment.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/img", express.static(path.join(__dirname, "..", "public", "img")));

app.use("/auth", authRoutes);
app.use("/api/restaurantes", restauranteRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/pagos", pagoRoutes);
app.use("/api/mesa", mesaRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/payments", paymentRoutes);

module.exports = app;