const express = require('express');
const {
        getParks,
    } = require('../controllers/parkController');
const router = express.Router();

router.route('/').get(getParks);

module.exports = router;