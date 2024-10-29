const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const cache = new Map();

async function calculateNimaScore(imagePath) {
  if (cache.has(imagePath)) {
    return cache.get(imagePath); // 캐시된 점수 반환
  }

  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    const response = await axios.post('http://localhost:5000/get_nima_score', form, {
      headers: form.getHeaders(),
      timeout: 10000  // 타임아웃 설정
    });

    if (response.status === 200) {
      const nimaScore = response.data.nima_scores[imagePath];
      cache.set(imagePath, nimaScore); // 점수 캐싱
      return nimaScore;
    } else {
      console.error('Failed to calculate NIMA score:', response.statusText);
    }
  } catch (error) {
    console.error('Error calculating NIMA score:', error);
  }
  return null;
}

module.exports = { calculateNimaScore };
