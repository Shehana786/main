const Plant = require('../Models/Plants');

// Add new plant
exports.addPlant = async (req, res) => {
  try {
    const { name, price, category, description, stock, featured, careTips } = req.body;

    // Parse careTips if string (sent as JSON string in multipart/form-data)
    let careTipsObj = {};
    if (careTips) {
      try {
        careTipsObj = typeof careTips === 'string' ? JSON.parse(careTips) : careTips;
      } catch {
        careTipsObj = {};
      }
    }

    const imageUrl = req.file ? req.file.filename : null;

    const plant = new Plant({
      name,
      price,
      category,
      description,
      stock,
      careTips: careTipsObj,
      imageUrl,
      featured: featured === 'true' || featured === true,
    });

    await plant.save();
    res.status(201).json({ message: 'Plant added successfully', plant });
  } catch (error) {
    res.status(500).json({ message: 'Error adding plant', error });
  }
};

// Update plant
exports.updatePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, stock, featured, careTips } = req.body;

    let careTipsObj = {};
    if (careTips) {
      try {
        careTipsObj = typeof careTips === 'string' ? JSON.parse(careTips) : careTips;
      } catch {
        careTipsObj = {};
      }
    }

    const imageUrl = req.file ? req.file.filename : undefined;

    const updatedFields = {
      name,
      price,
      category,
      description,
      stock,
      careTips: careTipsObj,
      featured: featured === 'true' || featured === true,
    };

    if (imageUrl) updatedFields.imageUrl = imageUrl;

    const updatedPlant = await Plant.findByIdAndUpdate(id, updatedFields, { new: true });

    res.json({ message: 'Plant updated successfully', updatedPlant });
  } catch (error) {
    res.status(500).json({ message: 'Error updating plant', error });
  }
};

// Get all plants (optional category filter)
exports.getAllPlants = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) filter.category = category;

    const plants = await Plant.find(filter);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plants', error });
  }
};

// Delete plant
exports.deletePlant = async (req, res) => {
  try {
    const { id } = req.params;
    await Plant.findByIdAndDelete(id);
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plant', error });
  }
};

// Get distinct categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Plant.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};

// Get featured plants
exports.getFeatured = async (req, res) => {
  try {
    const featured = await Plant.find({ featured: true });
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch featured products', error });
  }
};
// GET /api/products/:id
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching plant', error: err });
  }
};
