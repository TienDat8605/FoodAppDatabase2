const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticateMiddleware');
const cartController = require('../../controllers/cartController');


// Not using authMiddleware for development purposes, but should be protected in production
// GET items in cart
router.get('/', cartController.handleGetCartItems);
// Add item to cart
router.post('/', cartController.handleAddItemToCart);
// Update item in cart
router.put('/:itemId', cartController.handleUpdateItemInCart);
// Remove item from cart
router.delete('/:itemId', cartController.handleRemoveItemFromCart);
// Clear cart
router.delete('/', cartController.handleClearCart);
// Checkout cart: if success, move to order creation screen else don't do anything
router.post('/checkout', cartController.handleCheckoutCart);

// flow:
// 1. User adds items to cart
// 2. User checks out, creates an order from all cart items? or maybe only selected items?
// 3. Cart is cleared after checkout
// 4. If user view cart again -> cart is reloaded from database