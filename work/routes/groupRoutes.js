const express = require('express');
const router = express.Router();
const Group = require('../models/group');
const { selectRepresentativeImage } = require('../utils/nimaUtils'); // 대표 이미지 선택 함수 임포트

// 그룹 생성 API
router.post('/create', async (req, res) => {
  try {
    const { groupKey, uniqueID, images } = req.body;
    const newGroup = new Group({ groupKey, uniqueID, images });

    const representativeImage = await selectRepresentativeImage(images);
    newGroup.representativeImage = representativeImage._id;

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(500).json({ message: 'Error creating group', error: err });
  }
});

// 그룹 조회 API
router.get('/:groupId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('images representativeImage');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving group', error: err });
  }
});

// 그룹 삭제 API
router.delete('/:groupId', async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.groupId);
    if (!deletedGroup) return res.status(404).json({ message: 'Group not found' });
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting group', error: err });
  }
});

// 그룹 업데이트 API (이미지 추가/제거)
router.put('/:groupId', async (req, res) => {
  try {
    const { images } = req.body;
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.groupId,
      { images },
      { new: true }
    ).populate('images');

    if (!updatedGroup) return res.status(404).json({ message: 'Group not found' });

    // 업데이트된 이미지 목록에서 대표 이미지 다시 선택
    const representativeImage = await selectRepresentativeImage(updatedGroup.images);
    updatedGroup.representativeImage = representativeImage._id;
    await updatedGroup.save();

    res.status(200).json(updatedGroup);
  } catch (err) {
    res.status(500).json({ message: 'Error updating group', error: err });
  }
});

// 그룹 대표 이미지 조회 API
router.get('/:groupId/representative', async (req, res) => {
    try {
      const group = await Group.findById(req.params.groupId).populate('representativeImage');
  
      if (!group || !group.representativeImage) {
        return res.status(404).json({ message: 'Group or representative image not found' });
      }
  
      res.status(200).json({ representativeImage: group.representativeImage });
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving representative image', error: err });
    }
  });

  // 그룹 대표 이미지 업데이트 API
router.put('/:groupId/representative', async (req, res) => {
    try {
      const { newRepresentativeImageId } = req.body; // 새 대표 이미지 ID를 받아옴
      const group = await Group.findById(req.params.groupId);
  
      if (!group) return res.status(404).json({ message: 'Group not found' });
  
      // 새 대표 이미지가 그룹의 이미지 목록에 포함되는지 확인
      if (!group.images.includes(newRepresentativeImageId)) {
        return res.status(400).json({ message: 'New representative image is not part of this group' });
      }
  
      // 새 대표 이미지로 업데이트
      group.representativeImage = newRepresentativeImageId;
      await group.save();
  
      res.status(200).json({ message: 'Representative image updated successfully', group });
    } catch (err) {
      res.status(500).json({ message: 'Error updating representative image', error: err });
    }
  });

module.exports = router;
