const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: [true, "Please enter a table number"] },
  seats: {
    type: Number,
    required: [true, "Please enter no of seats on table"],
  },
  status: { type: String, default: "Available" },
  price: { type: Number, default: 0 },
});

module.exports = mongoose.model("Table", tableSchema);
