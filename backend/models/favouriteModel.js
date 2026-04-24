const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    specieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bird'
    },
  },
);

// Para evitar duplicados
favouriteSchema.index({ userId: 1, specieId: 1 }, { unique: true });

module.exports = mongoose.model('Favourite', favouriteSchema);