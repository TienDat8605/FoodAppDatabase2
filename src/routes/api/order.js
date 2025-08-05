const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const orderController = require('../../controllers/orderController');

// GET /api/order - get all orders for authenticated user
router.get('/', authMiddleware, orderController.handleGetOrders);
// PUT /api/order/:orderId/cancel - cancel an order for authenticated user
router.put('/:orderId/cancel', authMiddleware, orderController.handleCancelOrder);

module.exports = router;