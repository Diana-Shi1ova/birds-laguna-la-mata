const express = require('express');
const {
        getObservations,
        getHistory,
        getHistoryRange,
    } = require('../controllers/eBirdController');
const router = express.Router();

router.route('/').get(getObservations);
router.route('/history').get(getHistory);
router.route('/history/range').get(getHistoryRange);

module.exports = router;