// models/nimaScore.js

const mongoose = require('mongoose');

// NIMA 점수 스키마 정의
const nimaScoreSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true }, // 사진과 연동
  nimaScore: { type: Number, required: true },   // NIMA 점수
  evaluatedAt: { type: Date, default: Date.now } // 평가된 시간
});

// NimaScore 모델 생성
const NimaScore = mongoose.model('NimaScore', nimaScoreSchema);

module.exports = NimaScore;
