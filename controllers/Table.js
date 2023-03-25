const mongoose = require("mongoose");
const Table = require("../models/Table");
const Restaurant = require("../models/Restaurant");

exports.addTable = async (req, res) => {
  try {
    const { restaurantId, number, seats, price } = req.body;

    let table = await Table.findOne({ number });

    if (table) {
      return res.status(409).json({
        success: false,
        message: "Table Already Exists",
      });
    }

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

    const newTable = {
      number,
      seats,
      price,
    };

    table = await Table.create(newTable);

    restaurant.tables.push(table._id);
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Table added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    const restaurant = await Restaurant.findOne({
      tables: { $in: mongoose.Types.ObjectId(req.params.id) },
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

    table.remove();
    await table.save();

    const index = restaurant.tables.indexOf(
      mongoose.Types.ObjectId(req.params.id)
    );
    restaurant.tables.splice(index, 1);
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTables = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "tables"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }
    res.status(200).json({
      success: true,
      data: restaurant.tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
