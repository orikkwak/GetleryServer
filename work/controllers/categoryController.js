const Category = require('../models/category');
const { labelImages } = require('../controllers/labelingController');

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const { imageUrls } = req.body;
  const label = await labelImages(imageUrls);
  const newCategory = new Category({ name: label, imageUrls });
  await newCategory.save();
  res.status(201).json(newCategory);
};

exports.updateCategoryName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await Category.findByIdAndUpdate(id, { name, isCustomName: true });
  res.json({ message: 'Category name updated' });
};
