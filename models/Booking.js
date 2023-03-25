const mongoose = require("mongoose");
const { ObjectId, Date: dateType } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
  orders: [
    {
      chef: { type: ObjectId || String, ref: "Chef", default: "any" },
      products: [{ type: ObjectId, ref: "Product" }],
    },
  ],
  tables: [{ type: ObjectId, ref: "Table", default: [] }],
  date: { type: dateType, require: [true, "Please enter booking  date"] },
  timing: { type: String, require: [true, "Please enter booking timing"] },
  duration: { type: Number, require: [true, "Please enter booking duration"] },
  comments: { type: String, default: "" },
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Booking", bookingSchema);
