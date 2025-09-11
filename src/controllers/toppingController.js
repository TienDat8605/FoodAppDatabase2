const Topping = require('../models/Topping');

const handleGetAllToppings = async (req, res) => {
  try {
    const toppings = await Topping.find({}, { name: 1, price: 1, category: 1 }); // Only needed fields
    res.json(toppings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error fetching toppings:', err);
  }
}

const handleCreateTopping = async (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !category || price == null) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  try {
    const newTopping = await Topping.create({ name, price, category });
    res.status(201).json(newTopping);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error creating topping:', err);
  }
}

const handleGetToppingByID = async (req, res) => {
  const toppingId = req.params.id;
  try {
    const topping = await Topping.findById(toppingId, { name: 1, price: 1, category: 1 }); // Only needed fields
    if (!topping) {
      return res.status(404).json({ error: 'Topping not found' });
    }
    res.json(topping);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error fetching topping:', err);
  }
}

module.exports = {
  handleGetAllToppings,
  handleCreateTopping,
  handleGetToppingByID
};
