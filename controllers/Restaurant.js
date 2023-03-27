const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const { uploadFile, getUrl, deleteFile } = require("../utils/storage");

exports.addRestaurant = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { name, description, type, address, service, cuisines } = req.body;

    const thumbnail = {
      fileName: req.file.originalname,
      url: await uploadFile("thubnails", req.file),
    };

    const newRestaurant = {
      owner: req.user._id,
      thumbnail,
      name,
      description,
      type,
      address,
      service,
      cuisines,
    };

    const restaurant = await Restaurant.create(newRestaurant);

    user.restaurants.push(restaurant._id);
    await user.save();

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await deleteFile(restaurant.thumbnail.url);

    await restaurant.remove();

    const user = await User.findById(req.user._id);
    const index = user.restaurants.indexOf(req.params.id);

    user.restaurants.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Restaurant deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserRestaurants = async (req, res) => {
  try {
    const restaurants = (await req.user.populate("restaurants")).restaurants;

    if (!restaurants.length) {
      return res.status(404).json({
        success: false,
        message: "No Restaurants added",
      });
    }

    for (let restaurant of restaurants) {
      if (!restaurant.thumbnail.url.includes("http")) {
        restaurant.thumbnail.url = await getUrl(restaurant.thumbnail.url);
      }
    }

    return res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (!restaurant.thumbnail.url.includes("http")) {
      restaurant.thumbnail.url = await getUrl(restaurant.thumbnail.url);
    }

    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});

    for (let restaurant of restaurants) {
      if (!restaurant.thumbnail.url.includes("http")) {
        restaurant.thumbnail.url = await getUrl(restaurant.thumbnail.url);
      }
    }

    return res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
