const express = require('express');
const {
    createUser,
    loginUser,
} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/login').post(loginUser);
router.route('/').post(createUser);

module.exports = router;