const express = require('express');
const NimaScore = require('../models/nimaScore');
const Photo = require('../models/photo');
const { calculateNimaScore } = require('../utils/nimaUtils');
const router = express.Router();

router.post('/save_nima_score', async (req, res) => {
  try {
    const { photoId, nimaScore } = req.body;
    const photo = await Photo.findById(photoId);

    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    let nimaScoreRecord = await NimaScore.findOne({ photoId });
    if (nimaScoreRecord) {
      nimaScoreRecord.nimaScore = nimaScore;
      await nimaScoreRecord.save();
    } else {
      const newNimaScore = new NimaScore({ photoId, nimaScore });
      await newNimaScore.save();
    }
    res.status(200).json({ message: 'NIMA score saved successfully' });
  } catch (err) {
    console.error('Error saving NIMA score:', err);
    res.status(500).json({ message: 'Error saving NIMA score', error: err.message });
  }
});

module.exports = router;
