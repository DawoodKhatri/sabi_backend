const mongoose = require("mongoose");

const { Decimal128, ObjectId } = mongoose.Schema.Types;

const chefSchema = new mongoose.Schema({
  photo: {
    fileName: { type: String, default: "photo.jpg" },
    url: { type: String, required: [true, "Please enter photo url"] },
  },
  name: { type: String, require: [true, "Please enter chef name"] },
  age: { type: Number, require: [true, "Please enter chef age"] },
  gender: { type: String, require: [true, "Please enter chef gender"] },
  rating: { type: Decimal128, default: 0 },
  speciality: { type: String },
});

module.exports = mongoose.model("Chef", chefSchema);
