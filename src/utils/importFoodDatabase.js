const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Food = require('../models/Food');
const connectDB = require('../config/database');

const foodJsonPath = path.join(__dirname, '../../foodDatabase/food_with_embeddings.json');
const foodPicturesDir = path.join(__dirname, '../../foodDatabase/images');

async function importFood() {
  await connectDB();
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
      //check if foodPicture is imported successfully
      if (!foodPicture.data) {
        console.error(`Failed to read image from ${foodPicturePath}`);
        continue; // Skip this item if image read fails
      }
    }
    else {
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
  mongoose.connection.close();
}

// update database with new database (update not create new)
async function updateFood() {
  await connectDB();
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
        contentType: contentType,
        filename: path.basename(foodPicturePath)
      };
    }
    await Food.updateOne(
      { name: item.name },
      {
        $set: {
          description: item.description,
          category: item.category,
          subcategories: item.subcategories,
          price: item.price,
          foodPicture,
          embedding: item.embedding
        }
      },
      { upsert: true } // Create if not exists
    );
    console.log(`Updated: ${item.name}`);
  }
  mongoose.connection.close();
}

importFood();

// Run updateFood() if you want to update the database instead of importing
// updateFood();