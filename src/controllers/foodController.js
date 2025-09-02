const Food = require('../models/Food');
const similarity = require('../utils/similarityFunction'); 
const Order = require('../models/Order');

const similarityFunctions = {
  cosine: similarity.cosineSimilarity,
  l2: similarity.L2Distance,
  hybrid: similarity.hybridSimilarity
};

const handleGetAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({}, { name: 1, description: 1, category: 1, subcategories: 1, price: 1, rating: 1, ratingCount:1, toppings: 1}); // Only needed fields
    const foodsMap = foods.map(food => ({ // Map to only necessary fields (no image or embedding)
      _id: food._id,
      name: food.name,
      description: food.description,
      category: food.category,
      subcategories: food.subcategories,
      price: food.price,
      rating: food.rating,
      ratingCount: food.ratingCount,
      toppings: food.toppings
    }));
    res.json(foodsMap);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error fetching food items:', err);
  }
}

const handleGetFoodByID = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId, { name: 1, description: 1, category: 1, subcategories: 1, price: 1, rating: 1, ratingCount:1, toppings: 1}); // Only needed fields
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    const foodMap = {
      _id: food._id,
      name: food.name,
      description: food.description,
      category: food.category,
      subcategories: food.subcategories,
      price: food.price,
      rating: food.rating,
      ratingCount: food.ratingCount,
      toppings: food.toppings
    };
    res.json(foodMap);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error fetching food item:', err);
  }
} 

const handleGetFoodImageByID = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId, { foodPicture: 1 });
    if (!food || !food.foodPicture || !food.foodPicture.data) {
      return res.status(404).json({ error: 'Food item or image not found' });
    }
    // return image res.json
    res.json(food.foodPicture);
    console.log(`Food image for ID ${foodId} fetched successfully`);
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

const handleSearchByCategory = async (req, res) => {
  const { category } = req.body; // Assuming category is passed as a query parameter
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }
  try {
    const foods = await Food.find({ category }, { _id: 1, name: 1, description: 1, price: 1, foodPicture: 1 });
    if (foods.length === 0) {
      return res.status(404).json({ error: 'No food items found for this category' });
    }
    // only return food id, name. Front end will handle description, price, and image
    const result = foods.map(food => ({
      _id: food._id,
      name: food.name,
      category: food.category,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error fetching food items by category:', err);
  }
}

const handleSearchBySubcategory = async (req, res) => {
  const { subcategory } = req.body; // Assuming subcategory is passed as a query parameter
  if (!subcategory) {
    return res.status(400).json({ error: 'Subcategory is required' });
  }
  try {
    const foods = await Food.find({ subcategories: subcategory }, { _id: 1, name: 1, description: 1, price: 1, foodPicture: 1 });
    if (foods.length === 0) {
      return res.status(404).json({ error: 'No food items found for this subcategory' });
    }
    // only return food id, name. Front end will handle description, price, and image
    const result = foods.map(food => ({
      _id: food._id,
      name: food.name,
      category: food.category,
      subcategories: food.subcategories,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error fetching food items by subcategory:', err);
  }
}

const handleSearch = async (req, res) => {
  // Search by category, subcategory, rating, and price range
  try {
    const { category, subcategory, rating, minPrice, maxPrice } = req.body;
    if (!category && !subcategory && !rating && minPrice == null && maxPrice == null) {
      return res.status(400).json({ error: 'At least one search parameter is required' });
    }
    const query = {};
    if (category) {
      query.category = category;
    }
    if (subcategory) {
      query.subcategories = { $in: Array.isArray(subcategory) ? subcategory : [subcategory] };
    }
    if (rating) {
      query.rating = { $gte: rating };
    }
    if (minPrice != null || maxPrice != null) {
      query.price = {};
      if (minPrice != null) query.price.$gte = minPrice;
      if (maxPrice != null) query.price.$lte = maxPrice;
    }
    const foods = await Food.find(query, { _id: 1, name: 1, description: 1, price: 1, foodPicture: 1 });
    if (foods.length === 0) {
      return res.status(404).json({ error: 'No food items found for the given criteria' });
    }
    // only return food id, name. Front end will handle description, price, and image
    const result = foods.map(food => ({
      _id: food._id,
      name: food.name,
      category: food.category,
      subcategories: food.subcategories,
      rating: food.rating,
      price: food.price
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error searching food items:', err);
  }
}

// Get best sellers based on order data (top 5) for each category
// Best sellers are determined by the number of times a food item appears in orders
const handleGetBestSellers = async (req, res) => {
  try {
    let bestSellers = await Order.aggregate([
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.foodId",
          count: { $sum: 1 } // keep original logic
        }
      },
      {
        $lookup: {
          from: "foods",
          localField: "_id",
          foreignField: "_id",
          as: "food"
        }
      },
      { $unwind: "$food" },
      {
        $group: {
          _id: "$food.category",
          foods: {
            $push: {
              _id: "$food._id",
              count: "$count"
            }
          }
        }
      },
      {
        $project: {
          category: "$_id",
          bestSellers: {
            $slice: [
              { $sortArray: { input: "$foods", sortBy: { count: -1 } } },
              5
            ]
          },
          _id: 0
        }
      }
    ]);

    // 🔑 always ensure 5 items
    for (let i = 0; i < bestSellers.length; i++) {
      const sellers = bestSellers[i].bestSellers;
      const missing = 5 - sellers.length;

      if (missing > 0) {
        const extraFoods = await Food.find({
          category: bestSellers[i].category,
          _id: { $nin: sellers.map(f => f._id) }
        })
          .limit(missing)
          .lean();

        for (const food of extraFoods) {
          sellers.push({
            _id: food._id,
            count: 0 // never ordered
          });
        }
      }
    }

    res.json(bestSellers);
  } catch (err) {
    console.error("Error fetching best sellers:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  handleGetAllFoods,
  handleGetFoodImageByID,
  handleSearchByEmbedding,
  handleSearchByCategory,
  handleSearchBySubcategory,
  handleSearch,
  handleGetFoodByID,
  handleGetBestSellers
};