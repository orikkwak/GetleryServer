// routes/photoRoutes.js

const express = require('express');
const Photo = require('../models/photo');  // 사진 모델 가져오기
const router = express.Router();

// 사진 업로드 API
router.post('/', async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    // 새로운 사진 생성
    const newPhoto = new Photo({
      title,
      description,
      imageUrl
    });

    // 데이터베이스에 저장
    const savedPhoto = await newPhoto.save();
    res.status(201).json(savedPhoto);  // 성공적으로 저장된 데이터를 반환
  } catch (err) {
    res.status(500).json({ message: 'Error saving photo', error: err });
  }
});

module.exports = router;
