const router = require('express').Router();
const favoriteController = require('../../controllers/favoriteController');
const authMiddleware = require('../../middlewares/authenticateMiddleware');

// because of authMiddleware, no need to pass userId in body
router.get('/', authMiddleware, favoriteController.handleGetUserFavorites);
router.post('/', authMiddleware, favoriteController.handleAddFoodToFavorites);
router.put('/', authMiddleware, favoriteController.handleRemoveFoodFromFavorites);

module.exports = router;