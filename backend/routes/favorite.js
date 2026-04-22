const express = require('express');
const {
        getFavourites,
        createFavourite,
        deleteFavourite
    } = require('../controllers/favoriteController');
const router = express.Router();


router.route('/:userId').get(getFavourites);
router.route('/').post(createFavourite);
router.route('/:id').delete(deleteFavourite);

module.exports = router;