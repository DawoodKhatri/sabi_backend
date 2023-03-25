const mongoose = require("mongoose");
const Chef = require("../models/Chef");
const Restaurant = require("../models/Restaurant");
const { uploadFile, getUrl, deleteFile } = require("../utils/storage");

exports.addChef = async (req, res) => {
  try {
    const { restaurantId, name, age, gender, speciality } = req.body;

    const photo = {
      fileName: req.file.originalname,
      url: await uploadFile("chefs", req.file),
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
    const newChef = {
      photo,
      name,
      age,
      gender,
      speciality,
    };

    const chef = await Chef.create(newChef);

    restaurant.chefs.push(chef._id);
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Chef added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteChef = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    const restaurant = await Restaurant.findOne({
      chefs: { $in: mongoose.Types.ObjectId(req.params.id) },
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

    await deleteFile(chef.photo.url);

    chef.remove();
    await chef.save();

    const index = restaurant.chefs.indexOf(
      mongoose.Types.ObjectId(req.params.id)
    );
    restaurant.chefs.splice(index, 1);
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Chef deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRestaurantChefs = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id).populate("chefs");

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    for (let chef of restaurant.chefs) {
        chef.photo.url = await getUrl(chef.photo.url);
    }

    return res.status(200).json({
      success: true,
      data: restaurant.chefs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllChefs = async (req, res) => {
  try {
    const chefs = await Chef.find({});

    for (let chef of chefs) {
      chef.photo.url = await getUrl(chef.photo.url);
    }

    return res.status(200).json({
      success: true,
      data: chefs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
