const Booking = require("../models/Booking");
const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const { generateSlots } = require("../utils/booking");

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const restaurant = await Restaurant.findById(req.query.id).populate([
      "bookings",
    ]);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const bookings = restaurant.bookings;
    const tables = restaurant.tables;

    let allSlots = generateSlots(
      restaurant.service.open_time,
      restaurant.service.close_time
    );

    const slotsWithTables = allSlots.map((timeSlot) => ({
      time_slot: timeSlot,
      tables: tables.filter(
        ({ _id: tableId }) =>
          bookings.filter(
            ({
              date: bookingDate,
              time_slot: bookingSlot,
              tables: bookingTables,
            }) =>
              date === bookingDate &&
              timeSlot === bookingSlot &&
              bookingTables.includes(tableId)
          ).length === 0
      ),
    }));

    res.status(200).json({
      success: true,
      data: slotsWithTables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    console.log(req.body);
    const {
      orders,
      date,
      time_slot,
      name,
      email,
      phone,
      comments,
      advance_payment,
      tables,
    } = req.body;

    const booking = await Booking.create({
      restaurant: req.query.id,
      user: req.user._id,
      orders,
      date,
      time_slot,
      name,
      email,
      phone,
      comments,
      advance_payment,
      payment: req.body.payment ? req.body.payment : "Pending",
      tables,
    });

    const restaurant = await Restaurant.findById(req.query.id);
    const user = await User.findById(req.user._id);
    const cart = await Cart.findById(user.cart);

    restaurant.bookings.push(booking._id);
    await restaurant.save();

    user.bookings.push(booking._id);
    user.cart = null;
    await user.save();

    await cart.remove();

    return res.status(200).json({
      success: true,
      message: "Booking Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "Confirmed";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking Confirmed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "Cancelled";
    booking.message = req.query.message;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking Cancelled",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "Rejected";
    booking.message = req.query.message;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking Rejected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCustomerBookings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bookings = await Booking.find({
      _id: { $in: user.bookings },
    }).populate("restaurant");

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRestaurantBookings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    const bookings = await Booking.find({
      _id: { $in: restaurant.bookings },
    }).populate("user");

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
