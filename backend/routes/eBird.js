const express = require('express');
const {
        getObservations,
    } = require('../controllers/eBirdController');
const router = express.Router();

router.route('/').get(getObservations);

module.exports = router;