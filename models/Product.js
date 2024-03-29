const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please enter a product name"] },
  thumbnail: {
    fileName: { type: String, default: "thumbnail.jpg" },
    url: { type: String, required: [true, "Please enter thumbnail url"] },
  },
  categories: [{ type: String }],
  type: { type: "String", enum: ["veg", "nonVeg", "veg&NonVeg"] },
  cuisine: {
    type: String,
  },
  rating: {
    type: mongoose.SchemaTypes.Decimal128,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  tag: { type: String },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
  },
});

module.exports = mongoose.model("Product", productSchema);
