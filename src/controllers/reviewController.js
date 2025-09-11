const Review = require('../models/Review');
const Food = require('../models/Food');
const Order = require('../models/Order');

const handleAddReview = async (req, res) => {
    const userId = req.user.userId; // Get userId from authenticated request
    const foodId = req.params.foodId; // Get foodId from request parameters
    const { orderId, userName, commentText, rating } = req.body;

    // Validate input
    if (!foodId || !orderId || !commentText || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    try {
        // Check if the user has already reviewed this order
        const existingReview = await Review.findOne({ userId, orderId, foodId });
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this food in this order' });
        }

        // Check if the order exists and belongs to the user
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if the food item is part of the order
        const orderedItem = order.cartItems.find(item => item.foodId.toString() === foodId);
        if (!orderedItem) {
            return res.status(400).json({ error: 'Food item not part of the order' });
        }

        // Create and save the review
        const review = new Review({
            userId,
            userName,
            foodId,
            orderId,
            commentText,
            rating,
        });
        await review.save();

        // Update the food item's average rating and rating count
        const food = await Food.findById(foodId);
        if (food) {
            food.ratingCount += 1;
            food.averageRating = ((food.averageRating * (food.ratingCount - 1)) + rating) / food.ratingCount;
            await food.save();
        }

        res.status(201).json(review);
        console.log(`Review added by user ${userId} for food ${foodId}`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error adding review:', err);
    }
};

const handleGetReviewsByFoodId = async (req, res) => {
    const foodId = req.params.foodId; // Get foodId from request parameters
    try {
        const reviews = await Review.find({ foodId }).sort({ createdAt: -1 });
        res.json(reviews);
        console.log(`Reviews for food ${foodId} fetched successfully`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error fetching reviews:', err);
    }
}

const handleGetAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
        console.log('All reviews fetched successfully');
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error fetching all reviews:', err);
    }
}

module.exports = {
    handleGetAllReviews,
    handleAddReview,
    handleGetReviewsByFoodId,
};