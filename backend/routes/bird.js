const express = require('express');
const {
        getBirds,
        getWikidata
    } = require('../controllers/birdController');
const router = express.Router();

router.route('/').get(getBirds);
router.route('/wikidata').get(getWikidata);

module.exports = router;