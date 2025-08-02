const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const foodController = require('../../controllers/foodController');

// GET /api/food - get all food items
// not passing authMiddleware here for development purposes, but should be protected in production
router.get('/', foodController.handleGetAllFoods);
router.get('/:id/image', foodController.handleGetFoodImageByID);
router.post('/searchByEmbedding', foodController.handleSearchByEmbedding);
module.exports = router;