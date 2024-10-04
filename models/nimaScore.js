// models/nimaScore.js
const mongoose = require('mongoose');

const NimaScoreSchema = new mongoose.Schema({
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: true
  },
  nimaScore: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NimaScore', NimaScoreSchema);
