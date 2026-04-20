const express = require('express');
const {
        getBirds,
        getBirdById,
        getWikidata
    } = require('../controllers/birdController');
const router = express.Router();

router.route('/').get(getBirds);
router.route('/wikidata').get(getWikidata);
router.route('/:id').get(getBirdById);


module.exports = router;