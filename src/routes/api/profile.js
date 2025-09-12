const router = require('express').Router();
const profileController = require('../../controllers/profileController');
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const upload = require('../../middlewares/multerMiddleware'); // Import multer middleware

router.route('/')
  .get(authMiddleware, profileController.handleGetProfile) // GET profile by userId
  .put(authMiddleware ,profileController.handleUpdateProfile); // Update profile by userId
router.put(
  "/picture",
  authMiddleware,
  (req, res, next) => {
    console.log("Raw headers:", req.headers["content-type"]);
    req.on("data", chunk => {
      console.log("Received chunk size:", chunk.length);
    });
    req.on("end", () => {
      console.log("Request stream ended.");
    });
    next();
  },
  upload.single("profilePicture"),
  (req, res, next) => {
    console.log("Multer parsed file:", req.file);
    next();
  },
  profileController.handleAddProfilePicture
);


module.exports = router;
