const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrls: [{ type: String, required: true }],
  isCustomName: { type: Boolean, default: false },
});

module.exports = mongoose.model('Category', categorySchema);
