// 서버 파일 위치: server/scheduledTasks.js
const cron = require('node-cron');
const Photo = require('../models/image');
const fs = require('fs');
const path = require('path');

// 1시간마다 스케줄링 작업 실행
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  // 삭제 예정 시간이 지난 이미지들 찾기
  const imagesToDelete = await Photo.find({ deleteScheduledAt: { $lte: now } });

  imagesToDelete.forEach(async (image) => {
    // 데이터베이스에서 삭제
    await Photo.findByIdAndDelete(image._id);

    // 서버의 이미지 파일도 삭제
    const imagePath = path.join(__dirname, '../uploads/', image.path);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Deleted image file ${image.path}`);
    }
  });

  console.log(`${imagesToDelete.length} images deleted as per schedule`);
});
