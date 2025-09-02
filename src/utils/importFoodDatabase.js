const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Food = require('../models/Food');
const connectDB = require('../config/database');
const Topping = require('../models/Topping');

const foodJsonPath = path.join(__dirname, '../../foodDatabase/food_with_embeddings.json');
const foodPicturesDir = path.join(__dirname, '../../foodDatabase/images');

async function importFood() {
  const foodData = JSON.parse(fs.readFileSync(foodJsonPath, 'utf8'));
  for (const item of foodData) {
    const foodPicturePath = item.image_urls && item.image_urls[0]
      ? path.join(foodPicturesDir, path.basename(item.image_urls[0]))
      : null;
    let foodPicture = null;
    if (foodPicturePath && fs.existsSync(foodPicturePath)) {
      const ext = path.extname(foodPicturePath).toLowerCase();
      let contentType = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      foodPicture = {
        data: fs.readFileSync(foodPicturePath),
        contentType: contentType
      };
      if (!foodPicture.data) {
        console.error(`Failed to read image from ${foodPicturePath}`);
        continue;
      }
    } else {
      console.warn(`Image not found for ${item.name} at ${foodPicturePath}`);
    }
    await Food.create({
      name: item.name,
      description: item.description,
      category: item.category,
      subcategories: item.subcategories,
      price: item.price,
      foodPicture: foodPicture,
      embedding: item.embedding
    });
    console.log(`Imported: ${item.name}`);
  }
}

async function importToppings() {
  const toppingsJsonPath = path.join(__dirname, '../../foodDatabase/toppings.json');
  const toppingsData = JSON.parse(fs.readFileSync(toppingsJsonPath, 'utf8'));
  for (const item of toppingsData) {
    await Topping.create({
      name: item.name,
      price: item.price,
      category: item.category
    });
    console.log(`Imported topping: ${item.name}`);
  }
}

// update food item with toppings id for topping that match category 
async function updateFood() {
  const toppings = await Topping.find({});
  const foods = await Food.find({});
  for (const food of foods) {
    const matchedToppings = toppings
      .filter(topping => topping.category === food.category)
      .map(topping => topping._id);
    food.toppings = matchedToppings;
    await food.save();
    console.log(`Updated food: ${food.name} with toppings: ${matchedToppings.length}`);
  }
}

// update default rating of all food items to 5
async function updateDefaultRatings() {
  const foods = await Food.find({});
  for (const food of foods) {
    food.rating = 5;
    await food.save();
    console.log(`Updated food: ${food.name} with default rating 5`);
  }
}

async function main() {
  await connectDB();
  // await importFood();
  // await importToppings();
  // await updateFood();
  await updateDefaultRatings();
  mongoose.connection.close();
}

main();