//D:\getlery-server\utils\nimaUtils.js
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// NIMA 점수 계산 유틸리티 함수
async function calculateNimaScore(imagePath) {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath)); // 이미지 파일을 NIMA 서버에 업로드
    
    const response = await axios.post('http://localhost:5000/get_nima_score', form, {
      headers: form.getHeaders(),
    });

    if (response.status === 200) {
      const { nima_scores } = response.data;
      const nimaScore = Object.values(nima_scores)[0]; // 첫 번째 이미지의 NIMA 점수
      return nimaScore;
    } else {
      console.error('Failed to calculate NIMA score:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error calculating NIMA score:', error);
    return null;
  }
}

module.exports = {
  calculateNimaScore,
};
