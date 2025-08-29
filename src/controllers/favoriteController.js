const Favorite = require('../models/Favorite');

const handleGetUserFavorites = async (req, res) => {
    const userId = req.user.userId; // Get userId from authenticated request
    try {
        const favorite = await Favorite.findOne({ userId });
        // Check if favorite is empty
        if (!favorite) {
            return res.status(404).json({ error: 'No favorite items found for user' });
        }
        res.json(favorite);
        console.log(`Favorite items for user ${userId} fetched successfully`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error fetching favorite items:', err);
    }
}

const handleAddFoodToFavorites = async (req, res) => {
    const userId = req.user.userId; // Get userId from authenticated request
    try{
        const { foodId } = req.body; 
        if (!foodId) {
            return res.status(400).json({ error: 'foodId is required' });
        }
        // Find user's favorite document
        let favorite = await Favorite.findOne({ userId });
        if (favorite) {
            // Check if food already in favorites
            if (favorite.foods.includes(foodId)) {
                return res.status(400).json({ error: 'Food item already in favorites' });
            }
            favorite.foods.push(foodId);
            await favorite.save();
        } else {
            // Create new favorite document for user
            favorite = new Favorite({ userId, foods: [foodId] });
            await favorite.save();
        }
        res.status(201).json(favorite);
        console.log(`Food item added to favorites for user ${userId}`);

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error adding food to favorites:', err);
    }
}

const handleRemoveFoodFromFavorites = async (req, res) => {
    const userId = req.user.userId; // Get userId from authenticated request
    try {
        const { foodId } = req.body;
        if (!foodId) {
            return res.status(400).json({ error: 'foodId is required' });
        }
        // Find user's favorite document
        const favorite = await Favorite.findOne({ userId });
        if (!favorite || !favorite.foods.includes(foodId)) {
            return res.status(404).json({ error: 'Food item not found in favorites' });
        }
        // Remove food from favorites
        favorite.foods = favorite.foods.filter(id => id.toString() !== foodId);
        await favorite.save();
        res.json(favorite);
        console.log(`Food item removed from favorites for user ${userId}`);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
        console.error('Error removing food from favorites:', err);
    }
}

module.exports = {
    handleGetUserFavorites,
    handleAddFoodToFavorites,
    handleRemoveFoodFromFavorites
};