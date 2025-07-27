const router = require('express').Router();
const profileController = require('../../controllers/profileController');
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const upload = require('../../middlewares/multerMiddleware'); // Import multer middleware

router.route('/')
  .get(authMiddleware, profileController.handleGetProfile) // GET profile by userId
  .put(authMiddleware ,profileController.handleUpdateProfile); // Update profile by userId
router.put('/picture', authMiddleware, upload.single('profilePicture'), profileController.handleAddProfilePicture); // Update profile picture by userId
module.exports = router;