const router = require('express').Router();
const reviewController = require('../../controllers/reviewController');
const authMiddleware = require('../../middlewares/authenticateMiddleware');

router.post('/:foodId', authMiddleware, reviewController.handleAddReview);
router.get('/:foodId', authMiddleware, reviewController.handleGetReviewsByFoodId);
module.exports = router;