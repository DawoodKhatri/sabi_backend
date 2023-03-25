const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: [true, "Please enter a restaurant name"],
  },
  description: {
    type: String,
    required: [true, "Please enter a restaurant description"],
  },
  type: { type: "String", enum: ["veg", "nonVeg", "veg&NonVeg"] },
  address: {
    location: {
      lat: { type: Number, required: [true, "Please enter a location lat"] },
      lng: { type: Number, required: [true, "Please enter a location lng"] },
    },
    line: {
      type: String,
      required: [true, "Please enter an address line"],
    },
    locality: {
      type: String,
      required: [true, "Please enter an address locality"],
    },
    pinCode: {
      type: String,
      required: [true, "Please enter an address pinCode"],
    },
  },
  service: {
    daysOff: [
      { type: String, enum: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] },
    ],
    open_time: { type: String, required: [true, "Please enter a open time"] },
    close_time: { type: String, required: [true, "Please enter a close time"] },
  },
  cuisines: [{ type: String, required: [true, "Please enter cusines"] }],
  rating: { type: mongoose.SchemaTypes.Decimal128, default: 0 },
  reviews: [
    { type: mongoose.Schema.Types.ObjectId, default: [], ref: "Review" },
  ],
  staff: {
    chefs: [
      { type: mongoose.Schema.Types.ObjectId, default: [], ref: "Staff" },
    ],
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "Product",
    },
  ],
  tables: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: "Table" }],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "Booking",
    },
  ],
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
