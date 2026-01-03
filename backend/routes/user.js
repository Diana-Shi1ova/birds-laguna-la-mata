const express = require('express');
const {
    getUsers,
    getUserByID,
    updateUser,
    createUser,
    deleteUser,
    loginUser,
    getMe,
    /*uploadAvatar,
    deleteAvatar,*/
    changePassword,
} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware.js');

const router = express.Router();

/*const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });*/


router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUserByID).delete(deleteUser).put(updateUser);

//router.route('/:id/avatar').post(protect, upload.single('avatar'), uploadAvatar).delete(protect, deleteAvatar);
router.route('/:id/password').put(protect, changePassword);


module.exports = router;