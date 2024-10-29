const express = require('express');
const { getRepresentativeImage } = require('../utils/nimaUtils');
const router = express.Router();

router.post('/nima_score', async (req, res) => {
  try {
    const { images } = req.body;
    const representative = await getRepresentativeImage(images);
    res.json(representative);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating NIMA score', error });
  }
});

module.exports = router;
