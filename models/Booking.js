const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
  restaurant: { type: ObjectId, ref: "Restaurant" },
  user: { type: ObjectId, ref: "User" },
  orders: [
    {
      chef: { type: ObjectId, ref: "Chef" },
      product: { type: ObjectId, ref: "Product" },
      quantity: { type: Number },
      _id: false,
    },
  ],
  tables: [{ type: ObjectId, ref: "Table", default: null }],
  date: { type: String, required: [true, "Please enter booking date"] },
  time_slot: { type: String, required: [true, "Please enter time slot"] },
  name: { type: String, required: [true, "Please enter name of customer"] },
  email: {
    type: String,
    required: [true, "Please enter email address of customer"],
  },
  phone: {
    type: String,
    required: [true, "Please enter phone number of customer"],
  },
  comments: { type: String, default: "" },
  status: { type: String, default: "Pending" },
  total_bill: { type: Number, required: [true, "Please enter total amount"] },
  advance_payment: {
    type: Number,
    required: [true, "Please pay 50% Amount in Advance"],
  },
  payment: { type: String, default: "Pending" },
  rating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Booking", bookingSchema);
