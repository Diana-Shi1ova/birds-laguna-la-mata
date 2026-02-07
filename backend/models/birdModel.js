const mongoose = require('mongoose');

const birdSchema = new mongoose.Schema(
  {
    sciName: {
      type: String,
      unique: true,
      required: [true, 'Please add a scientific name'],
    },
    comName: {
      type: String,
    },
    speciesCode: {
      type: String,
    },
    category: {
      type: String,
    },
    taxonOrder: {
      type: Number,
    },
    bandingCodes: {
      type: [String],
    },
    comNameCodes: {
      type: [String],
    },
    sciNameCodes: {
      type: [String],
    },
    order: {
      type: String,
    },
    familyCode: {
      type: String,
    },
    familyComName: {
      type: String,
    },
    familySciName: {
      type: String,
    },
    wikidata: {
        id: {
            type: String,
        },
        images: {
            type: [String],
        },
        wikipediaURL: {
            type: String,
        }
    }
  }
);

module.exports = mongoose.model('Bird', birdSchema);