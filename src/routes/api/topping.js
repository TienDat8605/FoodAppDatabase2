const router = require('express').Router();
const toppingController = require('../../controllers/toppingController');

// GET /api/topping - get all toppings
router.get('/', toppingController.handleGetAllToppings);
// POST /api/topping - create a new topping
router.post('/', toppingController.handleCreateTopping);
// GET /api/topping/:id - get topping by ID
router.get('/:id', toppingController.handleGetToppingByID);

module.exports = router;