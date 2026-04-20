const mongoose = require('mongoose');

const ParkSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add name code'],
      unique: true,
    },
    lat: {
      type: Number,
      required: [true, 'Please add latitude'],
    },
    long: {
      type: Number,
      required: [true, 'Please add longitude'],
    },
    radius: {
      type: Number,
      required: [true, 'Please add radius'],
    },
    zoom: {
      type: Number,
    },
    region_code: {
      type: String,
    }
  }
);

module.exports = mongoose.model('Park', ParkSchema);