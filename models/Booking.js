const mongoose = require("mongoose");
const { ObjectId, Date: dateType } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
  orders: [
    {
      chef: { type: ObjectId || null, ref: "Chef" },
      products: [{ type: ObjectId, ref: "Product" }],
    },
  ],
  table: { type: ObjectId, ref: "Table", default: null },
  date: { type: dateType, require: [true, "Please enter booking  date"] },
  timing: { type: String, require: [true, "Please enter booking timing"] },
  duration: { type: Number, require: [true, "Please enter booking duration"] },
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
});

module.exports = mongoose.model("Booking", bookingSchema);
