const path = require('path');
const { calculateNimaScore } = require('./nimaUtils');  // NIMA 점수 계산 함수

async function getRepresentativeImage(images) {
  let highestScore = -1;
  let representativeImage = null;

  for (const image of images) {
    const score = await calculateNimaScore(path.join('uploads', image));
    if (score > highestScore) {
      highestScore = score;
      representativeImage = image;
    }
  }

  return { image: representativeImage, score: highestScore };
}

module.exports = { getRepresentativeImage };
