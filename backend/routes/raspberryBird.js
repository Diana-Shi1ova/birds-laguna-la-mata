const express = require('express');
const {
        getObservationsAudio,
        getObservationsNamesAudio,
        getObservationsImage
    } = require('../controllers/raspberryBirdController');
const router = express.Router();

router.route('/audio/:id').get(getObservationsAudio);
// router.route('/audio').get(getObservationsAudio);
router.route('/audio/names').get(getObservationsNamesAudio);
router.route('/image/:id').get(getObservationsImage);
// router.route('/image').get(getObservationsImage);

module.exports = router;