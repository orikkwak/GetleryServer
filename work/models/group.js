const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupKey: { type: Date, required: true },  // 그룹을 식별하는 키 (Date 타입)
  uniqueID: { type: String, required: true, unique: true },  // 고유 ID
  images: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],  // 연결된 이미지 ID 배열
  representativeImage: { type: Schema.Types.ObjectId, ref: 'Photo' },  // 대표 이미지 ID (NIMA 점수 기반)
});

// 그룹 모델의 대표 이미지를 NIMA 점수로 선택하는 함수
groupSchema.methods.selectRepresentativeByNima = async function() {
  // images 배열을 NIMA 점수로 정렬하여 첫 번째 이미지를 대표 이미지로 설정
  await this.populate('images');  // 이미지 참조 로드

  this.images.sort((a, b) => (b.nimaScore || 0) - (a.nimaScore || 0));
  this.representativeImage = this.images.length > 0 ? this.images[0]._id : null;
};

// 이미지 추가 시 대표 이미지 자동 선택
groupSchema.methods.addImage = async function(imageId) {
  this.images.push(imageId);
  await this.selectRepresentativeByNima();  // NIMA 점수에 따라 대표 이미지 갱신
};

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
