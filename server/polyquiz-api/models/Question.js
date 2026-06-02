const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true
    },

    options: {
        type: [String],
        required: true,
        minlength: 2,
        maxlength: 4,
        validate: { validator: function (v) { return v.length === new Set(v).size; }, message: '{PATH} must have unique values' }
    },

    correctAnswer: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Question", questionSchema);
