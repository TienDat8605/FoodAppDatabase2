const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const foodController = require('../../controllers/foodController');

// GET /api/food - get all food items
// not passing authMiddleware here for development purposes, but should be protected in production
router.get('/', foodController.handleGetAllFoods);
router.post('/searchByEmbedding', foodController.handleSearchByEmbedding);
// Search food items by category
router.post('/searchByCategory', foodController.handleSearchByCategory);
// Search food items by subcategory
router.post('/searchBySubcategory', foodController.handleSearchBySubcategory);
// search food items by category, subcategory, and rating
router.post('/search', foodController.handleSearch);
// get best sellers food items
router.get('/bestSellers', foodController.handleGetBestSellers);
// get food item by ID
router.get('/:id', foodController.handleGetFoodByID);
router.get('/:id/image', foodController.handleGetFoodImageByID);
module.exports = router;
