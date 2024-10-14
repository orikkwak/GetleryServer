const express = require('express');
const router = express.Router();
const multer = require('multer');
const Photo = require('../models/photo');
const { calculateNimaScore } = require('../utils/nima');
const upload = multer({ dest: 'uploads/' });

// 사진 업로드 API
router.post('/', async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const newPhoto = new Photo({
      title,
      description,
      imageUrl,
    });
    const savedPhoto = await newPhoto.save();
    res.status(201).json(savedPhoto);
  } catch (err) {
    res.status(500).json({ message: 'Error saving photo', error: err });
  }
});

// 이미지 삭제 라우트
router.delete('/delete', async (req, res) => {
  try {
    const { imageId } = req.body;
    const deletedPhoto = await Photo.findOneAndDelete({ _id: imageId });

    if (!deletedPhoto) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const imagePath = path.join(__dirname, '../uploads/', deletedPhoto.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // 서버에서 파일 삭제
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting image', error: err });
  }
});

module.exports = router;
