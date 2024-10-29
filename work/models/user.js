// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },  // 고유한 사용자 ID (휴대폰 고유 정보)
  nickname: { type: String, required: true },  // 사용자 닉네임
  createdAt: { type: Date, default: Date.now },  // 계정 생성일
});

const User = mongoose.model('User', userSchema);
module.exports = User;
