const express = require('express');
const router = express.Router();
const User = require('../models/user');

// 사용자 자동 로그인 및 생성 API
router.post('/login', async (req, res) => {
  try {
    const { deviceId } = req.body;
    let user = await User.findOne({ deviceId });

    if (!user) {
      user = new User({ deviceId, username: `user-${Math.floor(1000 + Math.random() * 9000)}` });
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// 사용자 조회 API
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err });
  }
});

// 사용자 정보 업데이트 API
router.put('/:userId', async (req, res) => {
  try {
    const { username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { username },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
});

// 사용자 삭제 API
router.delete('/:userId', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

module.exports = router;
