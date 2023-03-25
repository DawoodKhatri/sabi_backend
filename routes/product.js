const express = require("express");
const { addProduct, deleteProduct, getProduct, getProducts } = require("../controllers/Product");
const { isAuthenticated, isBusinessAuth } = require("../middlewares/auth");

const router = express.Router();

router.route("/product/add").post(isAuthenticated, isBusinessAuth, addProduct);
router.route("/product/:id").delete(isAuthenticated, isBusinessAuth, deleteProduct);
router.route("/product/:id").get(getProduct);
router.route("/products/:id").get(getProducts);

module.exports = router;
