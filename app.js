const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin: ["http://localhost:3000", "https://sabi-test.onrender.com"]}));

require("dotenv").config({ path: "./config/config.env" });

const user = require("./routes/user");
const restaurant = require("./routes/restaurant");
const product = require("./routes/product");
const table = require("./routes/table");

app.use("/api", user);
app.use("/api", restaurant);
app.use("/api", product);
app.use("/api", table);

module.exports = app;
