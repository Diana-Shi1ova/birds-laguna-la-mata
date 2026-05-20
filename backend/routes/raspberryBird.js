const express = require('express');
const {
        getObservationsAudio,
        getObservationsNamesAudio,
        getObservationsImage,
        getNumResults
    } = require('../controllers/raspberryBirdController');
const router = express.Router();

router.route('/total/:parkId').get(getNumResults);
router.route('/audio/:id').get(getObservationsAudio);
router.route('/audio/names').get(getObservationsNamesAudio);
router.route('/image/:id').get(getObservationsImage);

module.exports = router;