//D:\getlery-server\routes\userRoutes.js
const express = require('express');
const User = require('../models/user');
const router = express.Router();

// 랜덤 닉네임 생성 함수
function generateRandomUsername() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);  // 1000에서 9999 사이의 랜덤 숫자
  return `user-${randomNum}`;
}

// 사용자 자동 로그인 및 생성 API
router.post('/login', async (req, res) => {
  try {
    const { deviceId } = req.body;

    let user = await User.findOne({ deviceId });
    if (!user) {
      const username = generateRandomUsername();
      user = new User({ deviceId, username });
      await user.save();
    }

    res.status(200).json(user);  // 사용자 정보 반환
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

module.exports = router;
