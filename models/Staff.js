const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({});

module.exports = mongoose.model("Staff", staffSchema);
