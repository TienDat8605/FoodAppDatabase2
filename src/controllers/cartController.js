const Cart = require('../models/Cart');

const handleGetCartItems = async (req, res) => {
    const userId = req.user.UserId; // Get userId from authenticated request
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const cartItems = await Cart.find({ userId })//.populate('foodId', 'name price foodPicture'); // no need to populate foodId for now
        // Check if cartItems is empty
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ error: 'No items found in cart' });
        }
        res.json(cartItems);
        console.log(`Cart items for user ${userId} fetched successfully`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error fetching cart items:', err);
    }
}

const handleAddItemToCart = async (req, res) => {
    const userId = req.user.UserId; // Get userId from authenticated request
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try{
        const { name, toppings, quantity, price } = req.body; 
        if (!name || !quantity || !price) {
            return res.status(400).json({ error: 'name and quantity and price are required' });
        }
        // Check if item already exists in cart
        let cartItem = await Cart.findOne({ name, toppings });
        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.price += price;
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = new Cart({ userId, name, toppings, quantity, price });
            await cartItem.save();
        }
        res.status(201).json(cartItem);
        console.log(`Item added to cart for user ${userId}`);

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error adding item to cart:', err);
    }
}

const handleUpdateItemInCart = async (req, res) => { //don't let user update toppings, only quantity, price, selected
    const userId = req.user.UserId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const cartItemId = req.params.cartItemId; // Get cart item ID from request parameters
        const { quantity, price, selected } = req.body;
        // Validate cartItemId presence
        if (!cartItemId) {
            return res.status(400).json({ error: 'Cart item Id is required' });
        }
        // Build update object dynamically
        const updateFields = {};
        if (quantity !== undefined) {
            if (quantity < 1) {
                return res.status(400).json({ error: 'Quantity must be at least 1' });
            }
            updateFields.quantity = quantity;
        }
        if (selected !== undefined) {
            updateFields.selected = selected;
        }
        if (price !== undefined) {
            if (price < 0) {
                return res.status(400).json({ error: 'Price must be a positive number' });
            }
            updateFields.price = price;
        }
        // Ensure at least one field is being updated
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'Nothing to update' });
        }
        // Find and update the cart item
        const cartItem = await Cart.findOneAndUpdate(
            { _id : cartItemId, userId },
            {$set: updateFields},
            { new: true }
        );
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json(cartItem);
        console.log(`Cart item for user ${userId} updated successfully`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error updating cart item:', err);
    }
};


const handleRemoveItemFromCart = async (req, res) => {
    const userId = req.user.UserId; // Get userId from authenticated request
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const { cartItemId } = req.params; // Get cart item ID from request parameters
        if (!cartItemId) {
            return res.status(400).json({ error: 'Cart Item ID is required' });
        }
        // Find and remove cart item
        const cartItem = await Cart.findOneAndDelete({ userId, _id: cartItemId });
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json({ message: 'Cart item removed successfully', cartItem });
        console.log(`Cart item for user ${userId} removed successfully`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error removing cart item:', err);
    }
}

const handleClearSelectedCart = async (req, res) => {
    const userId = req.user.UserId; // Get userId from authenticated request
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        // Remove all items from the user's cart
        await Cart.deleteMany({ userId, selected: true });
        res.json({ message: 'Cart cleared successfully' });
        console.log(`Cart for user ${userId} cleared successfully`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error clearing cart:', err);
    }
}

const handleCheckoutCart = async (req, res, next) => {
    //return a lists of items to be ordered (selected items)
    const userId = req.user.UserId; // Get userId from authenticated request
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        // Find all selected items in the user's cart
        const cartItems = await Cart.find({ userId, selected: true });
        if (cartItems.length === 0) {
            return res.status(404).json({ error: 'No selected items found in cart' });
        }
        // Here you would typically create an order from these items (let orderController handle that)
        req.cartItems = cartItems; // Attach cart items to request for further processing
        next(); // Proceed to the next middleware or controller
        console.log(`Checkout successful for user ${userId}`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error during checkout:', err);
    }
}

module.exports = {
    handleGetCartItems,
    handleAddItemToCart,
    handleUpdateItemInCart,
    handleRemoveItemFromCart,
    handleClearSelectedCart,
    handleCheckoutCart
};