const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupKey: { type: Date, required: true },  // 그룹을 식별하는 키 (Date 타입)
  uniqueID: { type: String, required: true, unique: true },  // 고유 ID
  images: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],  // 연결된 이미지 ID 배열
  representativeImage: { type: Schema.Types.ObjectId, ref: 'Photo' },  // 대표 이미지 ID (NIMA 점수 기반)
});

// 그룹 모델의 대표 이미지를 NIMA 점수로 선택하는 함수
groupSchema.methods.selectRepresentativeByNima = function() {
  // images 배열을 NIMA 점수로 정렬하여 첫 번째 이미지를 대표 이미지로 설정
  this.images.sort((a, b) => (b.nimaScore || 0) - (a.nimaScore || 0));
  this.representativeImage = this.images[0];
};

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
