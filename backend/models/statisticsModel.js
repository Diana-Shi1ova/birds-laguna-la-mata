const mongoose = require('mongoose');


const FrequencySchema = new mongoose.Schema(
  {
    week: {
      type: Number,
    },
    hour: {
      type: Number,
    },
    year: {
      type: Number,
    },
    freq: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OverallSchema = new mongoose.Schema(
  {
    totalChecklists: {
      type: Number,
    },
    detections: {
      type: Number,
    },
    probability: {
      type: Number,
    },
    confidence: {
      type: String,
    },
    confidenceScore: {
      type: Number,
    },
  },
  { _id: false }
);

const StatisticsSchema = new mongoose.Schema({
  specieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bird",
    index: true,
  },

  speciesCode: {
    type: String,
    index: true,
  },

  sciName: {
    type: String,
    required: true,
    index: true,
  },

  comName: {
    type: String,
  },

  parkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Park",
    index: true,
  },

  parkCode: {
    type: String,
    index: true,
  },

  seasonality: {
    type: [FrequencySchema],
  },

  hourly: {
    type: [FrequencySchema],
  },

  trend: {
    type: [FrequencySchema],
  },

  overall: OverallSchema,

  insights: {
    hasData: Boolean,
    trend: {
      direction: {
        type: String,
        enum: ["increasing", "decreasing", "stable", "unknown"],
      },
      slope: Number,
    },

    seasonality: {
      peakWeek: Number,
      strength: Number,
    },

    hourly: {
      peakHour: Number,
      morningBias: Boolean,
    },
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('statistics', StatisticsSchema);