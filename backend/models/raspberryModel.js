const mongoose = require('mongoose');

const raspberriesSchema = new mongoose.Schema(
  {
    area: {
      type: String,
    },
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },
    type: {
      type: String,
    },
    code: {
      type: String,
      required: [true, 'Please add code'],
      unique: true
    }
  }
);

module.exports = mongoose.model('Raspberry', raspberriesSchema);