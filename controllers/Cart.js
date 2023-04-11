const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Cart = require("../models/Cart");
const { ObjectId } = require("mongoose").Schema.Types;

exports.getCart = async (req, res) => {
  try {
    let cart = req.user.cart;

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    cart = await Cart.findById(cart).populate([
      "restaurant",
      "products.product",
    ]);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;

    let cart = req.user.cart;

    let restaurant;

    if (!cart) {
      restaurant = await Restaurant.findOne({
        products: { $in: productId },
      });

      cart = await Cart.create({ restaurant: restaurant._id });

      const user = await User.findById(req.user._id);
      user.cart = cart._id;
      await user.save();
    } else {
      cart = await Cart.findById(cart);
      restaurant = await Restaurant.findById(cart.restaurant);
    }

    if (!restaurant.products.includes(productId)) {
      return res.status(403).json({
        success: false,
        message: "This product does not belong to restaurant in cart",
      });
    }

    const cartItem = cart.products.filter(
      ({ product }) => product.toString() === productId
    )[0];

    if (cartItem) {
      const index = cart.products.indexOf(cartItem);
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: productId });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.reduceProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;

    let cart = req.user.cart;

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    cart = await Cart.findById(cart);

    const product = cart.products.filter(
      ({ product }) => product.toString() === productId
    )[0];

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product doesn't exist in cart",
      });
    }

    const index = cart.products.indexOf(product);
    cart.products[index].quantity -= 1;

    if (!cart.products[index].quantity) {
      cart.products.splice(index, 1);
    }

    if (!cart.products.length) {
      const user = await User.findById(req.user._id);
      user.cart = null;
      await user.save();

      await cart.remove();
    } else {
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;

    let cart = req.user.cart;

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    cart = await Cart.findById(cart);

    const product = cart.products.filter(
      ({ product }) => product.toString() === productId
    )[0];

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product doesn't exist in cart",
      });
    }

    const index = cart.products.indexOf(product);
    cart.products.splice(index, 1);

    if (!cart.products.length) {
      const user = await User.findById(req.user._id);
      user.cart = null;
      await user.save();

      await cart.remove();
    } else {
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    let cart = req.user.cart;

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    cart = await Cart.findById(cart);

    const user = await User.findById(req.user._id);
    user.cart = null;
    await user.save();

    cart.remove();
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
