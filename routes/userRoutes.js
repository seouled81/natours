const express = require('express');

const {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  resizeUserPhoto
} = require('../controllers/userController');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// restricting the following routes to logged in users
router.use(protect);

router.patch('/updatepassword', updatePassword);

router.get('/me', getMe, getUser);
router.patch('/updateme', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteme', deleteMe);

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
