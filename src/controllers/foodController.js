const Food = require('../models/Food');
const similarity = require('../utils/similarityFunction'); 

const similarityFunctions = {
  cosine: similarity.cosineSimilarity,
  l2: similarity.L2Distance,
  hybrid: similarity.hybridSimilarity
};

const handleGetAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({}, { name: 1, description: 1, category: 1, subcategories: 1, price: 1}); // Only needed fields
    const foodsWithImageUrl = foods.map(food => ({
      _id: food._id,
      name: food.name,
      description: food.description,
      category: food.category,
      subcategories: food.subcategories,
      price: food.price
    }));
    res.json(foodsWithImageUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error fetching food items:', err);
  }
}

const handleGetFoodImageByID = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId, { image: 1 });
    if (!food || !food.image || !food.image.data) {
      return res.status(404).json({ error: 'Food item or image not found' });
    }
    res.set('Content-Type', food.image.contentType);
    res.send(food.image.data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error fetching food image:', err);
  }
}

const handleSearchByEmbedding = async (req, res) => {
  const { embedding, similarityModel } = req.body; // Assuming embedding is passed as a query parameter
  if (!embedding) {
    return res.status(400).json({ error: 'Embedding is required' });
  }
  // Look up the function using the model name, or default to hybridSimilarity
  const model = similarityFunctions[similarityModel] || similarity.hybridSimilarity;
  try {
    const foods = await Food.find({}, { _id: 1, name: 1, embedding: 1 });
    const results = foods
      .filter(food => Array.isArray(food.embedding) && food.embedding.length === embedding.length)
      .map(food => ({
        foodID: food._id,
        foodName: food.name,
        similarity: model(embedding, food.embedding)
      }))
        .sort((a, b) => b.similarity - a.similarity); // Sort by similarity descending
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error searching food items by embedding:', err);
  }
}

module.exports = {
  handleGetAllFoods,
  handleGetFoodImageByID,
  handleSearchByEmbedding
};