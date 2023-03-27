const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new mongoose.Schema({
  restaurant: {
    type: ObjectId,
    ref: "Restaurant",
    require: [true, "Please specify restaurant"],
  },
  products: [
    {
      product: { type: ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      _id: false
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
