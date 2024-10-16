const express = require('express');
const NimaScore = require('../models/nimaScore');
const Photo = require('../models/photo');
const router = express.Router();
const { calculateNimaScore } = require('../utils/nimaUtils'); // NIMA 점수 계산 유틸리티 함수

// NIMA 점수 저장 및 계산 API
router.post('/save_nima_score', async (req, res) => {
  try {
    const { photoId, nimaScore } = req.body;
    
    // 서버에 해당 사진이 있는지 확인
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // 이미 NIMA 점수가 있는 경우 업데이트, 없는 경우 새로 저장
    let nimaScoreRecord = await NimaScore.findOne({ photoId: photo._id });

    if (nimaScoreRecord) {
      // 기존 NIMA 점수 업데이트
      nimaScoreRecord.nimaScore = nimaScore;
      await nimaScoreRecord.save();
      return res.status(200).json({
        message: 'NIMA score updated successfully',
        nimaScore: nimaScoreRecord
      });
    } else {
      // 새로운 NIMA 점수 저장
      const newNimaScore = new NimaScore({
        photoId: photo._id,
        nimaScore: nimaScore
      });

      const savedNimaScore = await newNimaScore.save();
      return res.status(200).json({
        message: 'NIMA score saved successfully',
        nimaScore: savedNimaScore
      });
    }
  } catch (err) {
    console.error('Error saving NIMA score:', err);
    return res.status(500).json({ 
      message: 'Error saving NIMA score', 
      error: err.message || err 
    });
  }
});

module.exports = router;
