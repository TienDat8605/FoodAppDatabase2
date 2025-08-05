const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const cartController = require('../../controllers/cartController');
const orderController = require('../../controllers/orderController');

// GET items in cart
router.get('/', authMiddleware, cartController.handleGetCartItems);
// Add item to cart
router.post('/', authMiddleware, cartController.handleAddItemToCart);
// Update item in cart
router.put('/:cartItemId', authMiddleware, cartController.handleUpdateItemInCart); //cartItemID is the cart item ID
// Remove item from cart
router.delete('/:cartItemId', authMiddleware, cartController.handleRemoveItemFromCart);
// Clear cart
router.delete('/', authMiddleware, cartController.handleClearSelectedCart);
// Checkout cart: if success, move to order creation screen else don't do anything
router.post('/checkout', authMiddleware, cartController.handleCheckoutCart, orderController.handleCreateOrder);

// flow:
// 1. User adds items to cart
// 2. User checks out, creates an order from all cart items? or maybe only selected items?
// 3. Cart is cleared after checkout
// 4. If user view cart again -> cart is reloaded from database

module.exports = router;