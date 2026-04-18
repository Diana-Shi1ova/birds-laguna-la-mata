const mongoose = require('mongoose');

const raspberryAudioSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
    },
    date: {
      type: String,
    },
    hour: {
      type: String,
    },
    name: {
      type: String,
    },
    path: {
      type: String,
      unique: true,
    },
    raspberry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Raspberry'
    },
  }
);

module.exports = mongoose.model('Raspberry_Audio_Birds', raspberryAudioSchema);