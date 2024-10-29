const express = require('express');
const User = require('../models/user');
const router = express.Router();

// 사용자 자동 로그인 및 생성 API
router.post('/login', async (req, res) => {
  try {
    const { deviceId } = req.body;

    let user = await User.findOne({ deviceId });
    if (!user) {
      user = new User({ deviceId, username: `user-${Math.floor(1000 + Math.random() * 9000)}` });
      await user.save();
    }

    res.status(200).json(user);  // 사용자 정보 반환
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

module.exports = router;
