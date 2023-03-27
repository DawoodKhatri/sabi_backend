const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://sabi-dine.vercel.app",
      "https://sabi-test.onrender.com",
    ],
    credentials: true,
  })
);

require("dotenv").config({ path: "./config/config.env" });

const user = require("./routes/user");
const restaurant = require("./routes/restaurant");
const product = require("./routes/product");
const table = require("./routes/table");
const chef = require("./routes/chef");
const cart = require("./routes/cart");

app.use("/api", user);
app.use("/api", restaurant);
app.use("/api", product);
app.use("/api", table);
app.use("/api", chef);
app.use("/api", cart);

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
