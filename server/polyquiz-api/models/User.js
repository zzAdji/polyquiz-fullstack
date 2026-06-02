const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[a-zA-Z0-9]+$/
  },

  bestScore: {
    type: Number,
    default: 0
  },
});

module.exports = mongoose.model("User", userSchema);