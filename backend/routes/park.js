const express = require('express');
const {
        getParks,
        getParkById
    } = require('../controllers/parkController');
const router = express.Router();

router.route('/').get(getParks);
router.route('/:id').get(getParkById);

module.exports = router;