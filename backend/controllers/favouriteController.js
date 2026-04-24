const Favourite = require('../models/favouriteModel');
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

/*const getFavourites = async (req, res) => {
    try {
        const { userId } = req.params;

        const results = await Favourite.aggregate([
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
}*/
const getFavourites = async (req, res) => {
    try {
        const { userId } = req.params;

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const skip = (page - 1) * limit;

        const matchStage = {
            userId: new mongoose.Types.ObjectId(userId)
        };

        const [results, total] = await Promise.all([
            Favourite.aggregate([
                { $match: matchStage },

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
                },

                { $skip: skip },
                { $limit: limit }
            ]),

            Favourite.countDocuments(matchStage)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            page,
            limit,
            totalItems: total,
            totalPages,
            data: results
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


// Crear favorito
const createFavourite = async (req, res) => {
    try {
        const { userId, specieId } = req.body;

        const existingFavourite = await Favourite.findOne({
            userId: userId,
            specieId: specieId
        });

        if (existingFavourite) {
            return res.status(409).json({ message: 'Favourite already exists' });
        }

        const newFavourite = new Favourite({
            userId: userId,
            specieId: specieId
        });

        const savedFavourite = await newFavourite.save();

        res.status(201).json(savedFavourite);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// Eliminar favorito
const deleteFavourite = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFavourite = await Favourite.findByIdAndDelete(id);

        if (!deletedFavourite) {
            return res.status(404).json({ message: 'Favourite not found' });
        }

        res.status(200).json({ message: 'Favourite deleted successfully', favourite: deletedFavourite});
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