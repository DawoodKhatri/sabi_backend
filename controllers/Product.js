const mongoose = require("mongoose");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");
const { uploadFile, getUrl } = require("../utils/storage");

exports.addProduct = async (req, res) => {
  try {
    const { restaurantId, name, cuisine, tag, price, type } = req.body;

    const thumbnail = {
      fileName: req.file.originalname,
      url: await getUrl(await uploadFile("thumbnails", req.file)),
    };

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (req.user._id.toString() !== restaurant.owner.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const newProduct = {
      name,
      thumbnail,
      categories: [],
      cuisine,
      tag,
      price,
      type,
    };

    const product = await Product.create(newProduct);

    restaurant.products.push(product._id);
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const restaurant = await Restaurant.findOne({
      products: { $in: mongoose.Types.ObjectId(req.params.id) },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant Not Found",
      });
    }

    if (req.user._id.toString() !== restaurant.owner.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    product.remove();
    await product.save();

    const index = restaurant.products.indexOf(
      mongoose.Types.ObjectId(req.params.id)
    );
    restaurant.products.splice(index, 1);
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "products"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
