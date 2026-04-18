const mongoose = require('mongoose');

const raspberryImageSchema = new mongoose.Schema(
  {
    image_name: {
      type: String,
      unique: true,
    },
    species_detected: {
      type: String,
    },
    behavior_detected: {
      type: String,
    },
    bbox: {
      type: String,
    },
    raspberry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Raspberry'
    },
  }
);

module.exports = mongoose.model('Raspberry_Image_Birds', raspberryImageSchema);