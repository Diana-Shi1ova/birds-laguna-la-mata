const Favorite = require('../models/favoriteModel');
const mongoose = require('mongoose');


// Obtener todos los favoritos del usuario
/*const getFavourites = async (req, res) => {
    try{
        const { userId } = req.params;

        const query = {
            userId: userId
        };

        const results = await Favorite.find(query);

        res.status(200).json(results);
    }
    catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}*/

const getFavourites = async (req, res) => {
    try {
        const { userId } = req.params;

        const results = await Favorite.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'birds',
                    localField: 'specieId',
                    foreignField: '_id',
                    as: 'bird'
                }
            },
            {
                $unwind: {
                    path: '$bird',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        res.status(200).json(results);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// Crear favorito
const createFavourite = async (req, res) => {
    try {
        const { userId, specieId } = req.body;

        const existingFavourite = await Favorite.findOne({
            userId: userId,
            specieId: specieId
        });

        if (existingFavourite) {
            return res.status(409).json({ message: 'Favourite already exists' });
        }

        const newFavourite = new Favorite({
            userId: userId,
            specieId: specieId
        });

        const savedFavourite = await newFavourite.save();

        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// Eliminar favorito
const deleteFavourite = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFavourite = await Favorite.findByIdAndDelete(id);

        if (!deletedFavourite) {
            return res.status(404).json({ message: 'Favourite not found' });
        }

        res.status(200).json({ message: 'Favourite deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}



module.exports = {
  getFavourites,
  createFavourite,
  deleteFavourite
};