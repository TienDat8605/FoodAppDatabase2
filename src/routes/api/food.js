const express = require('express');
const router = express.Router();
const Food = require('../../models/Food');
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const foodController = require('../../controllers/foodController');

// GET /api/food - get all food items
router.get('/', foodController.handleGetAllFoods);
router.get('/:id/image', foodController.handleGetFoodImageByID);
router.get('/searchByEmbedding', foodController.handleSearchByEmbedding);
module.exports = router;