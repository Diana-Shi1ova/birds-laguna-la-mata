const express = require('express');
const {
        getObservations,
        getHistory,
        getHistoryRange,
        getSpecies,
        getSpecieObservations
    } = require('../controllers/eBirdController');
const router = express.Router();

router.route('/').get(getObservations);
router.route('/history').get(getHistory);
router.route('/history/range').get(getHistoryRange);
// router.route('/species').post(getSpecies);
router.route('/species').get(getSpecies);
router.route('/:specieId').get(getSpecieObservations);

module.exports = router;