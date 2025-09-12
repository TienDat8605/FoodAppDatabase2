const router = require('express').Router();
const profileController = require('../../controllers/profileController');
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const upload = require('../../middlewares/multerMiddleware'); // Import multer middleware

router.route('/')
  .get(authMiddleware, profileController.handleGetProfile) // GET profile by userId
  .put(authMiddleware ,profileController.handleUpdateProfile); // Update profile by userId
router.post(
  '/picture',
  authMiddleware,
  (req, res, next) => {
    console.log("Headers:", req.headers["content-type"]);
    next();
  },
  upload.single("profilePicture"),
  (req, res) => {
    console.log("File parsed by Multer:", req.file);
    console.log("Body fields:", req.body);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ success: true });
  }
);

module.exports = router;
