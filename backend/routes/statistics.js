const express = require('express');
const {
        buildSpeciesStatistics,
        getSpecieStatistics,
        getParkStatistics
    } = require('../controllers/statisticsController');
const router = express.Router();

router.route('/').post(buildSpeciesStatistics);
router.route('/specie/:id').get(getSpecieStatistics);
router.route('/park/:parkId').get(getParkStatistics);


module.exports = router;