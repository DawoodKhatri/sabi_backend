const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exista"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    select: false,
  },
  isBusiness: {
    type: Boolean,
    required: [true, "Please specify is business"],
  },
  cart: {
    type: ObjectId,
    ref: "Cart",
    default: null,
  },
  bookings: [
    {
      type: ObjectId,
      ref: "Booking",
    },
  ],
  restaurants: [
    {
      type: ObjectId,
      ref: "Restaurant",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("User", userSchema);
