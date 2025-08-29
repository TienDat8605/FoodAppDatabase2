const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const orderController = require('../../controllers/orderController');

// GET /api/order - get all orders for authenticated user   
router.get('/', authMiddleware, orderController.handleGetOrders);

// GET /api/order/:orderId - get specific order by ID for authenticated user
router.get('/:orderId', authMiddleware, orderController.handleGetOrderById);

// PUT /api/order/:orderId/cancel - cancel an order for authenticated user
router.put('/:orderId/cancel', authMiddleware, orderController.handleCancelOrder);

// PUT /api/order/:orderId/complete- complete an order for authenticated user
router.put('/:orderId/complete', authMiddleware, orderController.handleCompleteOrder);

module.exports = router;