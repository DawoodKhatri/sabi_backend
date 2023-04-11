const express = require("express");
const { getCart, addProduct, reduceProduct, deleteProduct, clearCart } = require("../controllers/Cart");
const { isAuthenticated, isCustomerAuth } = require("../middlewares/auth");

const router = express.Router();

router.route("/cart").get(isAuthenticated, isCustomerAuth, getCart);
router.route("/cart").delete(isAuthenticated, isCustomerAuth, clearCart);
router.route("/cart/:id").post(isAuthenticated, isCustomerAuth, addProduct);
router.route("/cart/:id").patch(isAuthenticated, isCustomerAuth, reduceProduct);
router.route("/cart/:id").delete(isAuthenticated, isCustomerAuth, deleteProduct);

module.exports = router;
