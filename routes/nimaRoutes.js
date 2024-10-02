// routes/nimaRoutes.js

const express = require('express');
const NimaScore = require('../models/nimaScore');  // NIMA 점수 모델 가져오기
const Photo = require('../models/photo');          // 사진 모델 가져오기
const router = express.Router();

// NIMA 점수 저장 API
router.post('/save_nima_score', async (req, res) => {
  try {
    const { photoId, nimaScore } = req.body;

    // 해당 사진이 존재하는지 확인
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // NIMA 점수 저장
    const newNimaScore = new NimaScore({
      photoId: photo._id,
      nimaScore: nimaScore
    });

    const savedNimaScore = await newNimaScore.save();
    res.status(200).json(savedNimaScore);
  } catch (err) {
    res.status(500).json({ message: 'Error saving NIMA score', error: err });
  }
});

module.exports = router;