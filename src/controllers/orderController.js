const Order = require('../models/Order');

const handleGetOrders = async (req, res) => {
    const userId = req.user.userId
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const orders = await Order.find({ userId });
        //before return, update the order status (if pending after 60 seconds, set to confirmed)
         // Check and update status if order is pending for more than 60 seconds
        const now = new Date();
        const updatedOrders = await Promise.all(
            orders.map(async (order) => {
                if (order.status === 'pending') {
                const createdAt = new Date(order.createdAt);
                const diffSeconds = (now - createdAt) / 1000;
                if (diffSeconds >= 60) {
                    order.status = 'confirmed';
                    await order.save();
                    }
                }
                return order;
            })
        );
        res.json(updatedOrders);
        console.log(`Orders for user ${userId} fetched successfully`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error fetching orders:', err);
    }
}

const handleCreateOrder = async (req, res) => {
    const userId = req.user.userId
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    const cartItems = req.cartItems; // Get cart items from previous middleware
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'No items to order' });
    }
    try {
        const order = new Order({
            userId,
            cartItems: cartItems.map(item => ({
                name: item.name,
                toppings: item.toppings,
                quantity: item.quantity,
                price: item.price
            })),
            status: 'pending', // Initial status
            totalPrice: cartItems.reduce((total, item) => total + item.price, 0)
        });
        await order.save();
        res.status(201).json(order);
        console.log(`Order created for user ${userId}`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error creating order:', err);
    }
}

const handleCancelOrder = async (req, res) => {
    // Check if the order exists and is pending, then update its status to 'cancelled'
    // else if the order is confirmed or delivered, return an error
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const orderId = req.params.orderId; // Get order ID from request parameters
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending orders can be cancelled' });
        }
        order.status = 'cancelled';
        await order.save();
        res.json({ message: 'Order cancelled successfully', order });
        console.log(`Order ${orderId} cancelled for user ${userId}`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error cancelling order:', err);
    }
}

// no need for this function, because we will update the order status in handleGetOrders
// const handleUpdatePendingOrderStatus = async (req, res) => {

// }


// Rethink about update order status, maybe use a cron job to update all pending orders every 30 seconds 
// or use a websocket to update order status in real-time 
// or just let frontend handle it after getting the list of orders 

module.exports = {
    handleGetOrders,
    handleCreateOrder,
    handleCancelOrder,
    // handleUpdatePendingOrderStatus
};