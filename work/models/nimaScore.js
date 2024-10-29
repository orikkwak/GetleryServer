// models/nimaScore.js

const mongoose = require('mongoose');

const nimaScoreSchema = new mongoose.Schema({
  photoId: { type: String, required: true },  // 연관된 사진 ID
  nimaScore: { type: Number, required: true },  // NIMA 점수
  calculatedAt: { type: Date, default: Date.now },  // NIMA 점수가 계산된 시간
});

const NimaScore = mongoose.model('NimaScore', nimaScoreSchema);
module.exports = NimaScore;
