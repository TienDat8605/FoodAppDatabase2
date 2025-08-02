const Order = require('../models/Order');

const handleGetOrders = async (req, res) => {
    //before get, update the order status (if pending after 30 seconds, set to confirmed)
    //TODO(get orders for authenticated user)
}

const handleCreateOrder = async (req, res) => {
    //TODO(create order for authenticated user)
}

const handleCancelOrder = async (req, res) => {
    //TODO(cancel order for authenticated user)
}

const handleUpdatePendingOrderStatus = async (req, res) => {
    // if you have pending order, run this function every 30 seconds to update pending orders
    //TODO(update order status for authenticated user)
}


// Rethink about update order status, maybe use a cron job to update all pending orders every 30 seconds (GPT said this)
// or use a websocket to update order status in real-time (GPT said this too)
// or just let frontend handle it after getting the list of orders (me said this)
