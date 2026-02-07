const express = require('express');
const {
        getBirds,
    } = require('../controllers/birdController');
const router = express.Router();

router.route('/').get(getBirds);

module.exports = router;