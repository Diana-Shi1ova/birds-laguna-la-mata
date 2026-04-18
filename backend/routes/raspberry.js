const express = require('express');
const {
        getRaspberries,
    } = require('../controllers/raspberryController');
const router = express.Router();

router.route('/').get(getRaspberries);

module.exports = router;