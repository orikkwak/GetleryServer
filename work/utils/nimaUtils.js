// work/utils/nimaUtils.js
const axios = require('axios');

async function calculateNimaScore(imagePath) {
  try {
    const response = await axios.post('http://localhost:5000/nima_score', { imagePath });
    return response.data.score;
  } catch (error) {
    console.error("Error calculating NIMA score:", error);
    return null;
  }
}

module.exports = { calculateNimaScore };
