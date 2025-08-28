const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const orderController = require('../../controllers/orderController');

// GET /api/order - get all orders for authenticated user (does automatically update pending status to confirmed)  
router.get('/', authMiddleware, orderController.handleGetOrders);
// PUT /api/order/:orderId/cancel - cancel an order for authenticated user
router.put('/:orderId/cancel', authMiddleware, orderController.handleCancelOrder);
// update a specific order status from pending to confirmed
router.put('/:orderId/pendingToConfirmed', authMiddleware, orderController.handleUpdatePendingToConfirmed);
// update a specific order status from confirmed to delivered
router.put('/:orderId/confirmToDelivered', authMiddleware, orderController.handleUpdateConfirmToDelivered);

module.exports = router;