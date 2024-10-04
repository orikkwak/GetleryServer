// D:\getlery-server\models\photo.js

const mongoose = require('mongoose');

// 사진 메타데이터 스키마 정의
const photoSchema = new mongoose.Schema({
    title: { type: String, required: true },      // 사진 제목
    description: { type: String, required: true }, // 사진 설명
    imageUrl: { type: String, required: true },    // 이미지 URL 또는 경로
    createdAt: { type: Date, default: Date.now }   // 업로드 시간
  });

// Photo 모델 생성
const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
