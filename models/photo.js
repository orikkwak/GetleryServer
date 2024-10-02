// models/Photo.js

const mongoose = require('mongoose');

// 사진 스키마 정의
const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Photo 모델 생성
const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
