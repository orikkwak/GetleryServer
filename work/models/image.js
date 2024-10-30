const mongoose = require('mongoose');

// 개선된 photo 모델 스키마
const photoSchema = new mongoose.Schema({
  photoId: { type: String, required: true, unique: true },  // 사진 ID
  path: { type: String, required: true },  // 서버에 저장된 파일 경로
  createdAt: { type: Date, default: Date.now },  // 업로드된 시간
  nimaScore: { type: Number, default: 0 },  // NIMA 점수, 기본값은 0
  width: { type: Number, required: true },  // 이미지의 너비
  height: { type: Number, required: true },  // 이미지의 높이
  size: { type: Number, required: true },  // 파일 크기 (바이트 단위)
  mimeType: { type: String, required: true },  // 이미지 MIME 타입 (예: image/jpeg)
  isFavorite: { type: Boolean, default: false },  // 사용자가 즐겨찾기로 설정한 이미지인지 여부
  latitude: { type: Number },  // 이미지가 찍힌 위치의 위도
  longitude: { type: Number },  // 이미지가 찍힌 위치의 경도
  deleteScheduledAt: { type: Date } // 삭제 예정 시간 필드 추가
});

const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;
