const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Food = require('../models/Food');
const connectDB = require('../config/database');

const foodJsonPath = path.join(__dirname, '../../foodDatabase/food_with_embeddings.json');
const imagesDir = path.join(__dirname, '../../foodDatabase/images');

async function importFood() {
  await connectDB();
  const foodData = JSON.parse(fs.readFileSync(foodJsonPath, 'utf8'));
  for (const item of foodData) {
    const imagePath = item.image_urls && item.image_urls[0]
      ? path.join(imagesDir, path.basename(item.image_urls[0]))
      : null;
    let image = null;
    if (imagePath && fs.existsSync(imagePath)) {
      const ext = path.extname(imagePath).toLowerCase();
      let contentType = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      image = {
        data: fs.readFileSync(imagePath),
        contentType: contentType, // adjust if needed
        filename: path.basename(imagePath)
      };
    }
    await Food.create({
      name: item.name,
      description: item.description,
      category: item.category,
      subcategories: item.subcategories,
      price: item.price,
      image,
      embedding: item.embedding
    });
    console.log(`Imported: ${item.name}`);
  }
  mongoose.connection.close();
}

importFood();