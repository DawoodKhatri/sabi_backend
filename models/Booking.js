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
  date: { type: String, require: [true, "Please enter booking date"] },
  time_slot: { type: String, require: [true, "Please enter time slot"] },
  name: { type: String, require: [true, "Please enter name of customer"] },
  email: {
    type: String,
    require: [true, "Please enter email address of customer"],
  },
  phone: {
    type: String,
    require: [true, "Please enter phone number of customer"],
  },
  comments: { type: String, default: "" },
  status: { type: String, default: "Pending" },
  advance_payment: {
    type: String,
    require: [true, "Please pay 50% Amount in Advance"],
  },
  payment: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Booking", bookingSchema);
