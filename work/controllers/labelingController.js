const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

exports.labelImages = async (imageUrls) => {
  const [result] = await client.labelDetection(imageUrls[0]);
  const labels = result.labelAnnotations;
  return labels[0].description; // 첫 번째 라벨을 카테고리 이름으로 사용
};
