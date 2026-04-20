const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
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
favoriteSchema.index({ userId: 1, specieId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);