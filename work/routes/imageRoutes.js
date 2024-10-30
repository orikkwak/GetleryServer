const express = require('express');
const router = express.Router();
const multer = require('multer');
const Photo = require('../models/image');
const { calculateNimaScore } = require('../utils/nimaUtils');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');

// 사진 업로드 API
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file.filename;

    const nimaScore = await calculateNimaScore(req.file.path);
    const newPhoto = new Photo({ title, description, imageUrl, nimaScore });

    const savedPhoto = await newPhoto.save();
    res.status(201).json(savedPhoto);
  } catch (err) {
    res.status(500).json({ message: 'Error saving photo', error: err });
  }
});

// 사진 조회 API
router.get('/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);

    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving photo', error: err });
  }
});

// 사진 삭제 API
router.delete('/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    const deletedPhoto = await Photo.findByIdAndDelete(photoId);

    if (!deletedPhoto) return res.status(404).json({ message: 'Photo not found' });

    const imagePath = path.join(__dirname, '../uploads/', deletedPhoto.imageUrl);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); // 파일 삭제

    res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting photo', error: err });
  }
});

// 특정 이미지의 삭제 일정을 설정하는 API (5시간 후 삭제 예정)
router.post('/schedule-delete/:id', async (req, res) => {
  try {
    const image = await Photo.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // 현재 시간 기준으로 5시간 뒤 삭제 일정 설정
    const deleteTime = new Date(Date.now() + 5 * 60 * 60 * 1000);
    image.deleteScheduledAt = deleteTime;
    await image.save();

    res.status(200).json({ message: 'Delete schedule set for image', deleteScheduledAt: deleteTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 사진 업데이트 API
router.put('/:photoId', async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedPhoto = await Photo.findByIdAndUpdate(
      req.params.photoId,
      { title, description },
      { new: true }
    );

    if (!updatedPhoto) return res.status(404).json({ message: 'Photo not found' });
    res.status(200).json(updatedPhoto);
  } catch (err) {
    res.status(500).json({ message: 'Error updating photo', error: err });
  }
});

module.exports = router;
