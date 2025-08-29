const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


const Order = require('../models/Order');
const Food = require('../models/Food');
const connectDB = require('../config/database');

async function insertOrder() {
  await connectDB();

  // Replace with actual user and food IDs from your database
  const userId = new mongoose.Types.ObjectId('68b06741d8304c03f28c6d3e');
  const foodId = new mongoose.Types.ObjectId('68b06b6eb9b8f16d7bedb4e6');

  // Fetch food from DB
  const food = await Food.findById(foodId);
  if (!food) {
    console.error('Food not found!');
    mongoose.connection.close();
    return;
  }

  // Insert order
  await Order.create({
    userId: userId,
    cartItems: [
      {
        foodId: food._id,
        name: food.name,
        toppings: [],
        quantity: 1,
        price: food.price
      }
    ],
    totalPrice: food.price,
    status: 'pending',
    deliveryAddress: '123 Main St, Cityville'
  });

  console.log('Order inserted!');
  mongoose.connection.close();
}

insertOrder();