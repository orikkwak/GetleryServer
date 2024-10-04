// D:\getlery-server\app.js
// 환경 변수 설정
require('dotenv').config();

// Express 설정
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const photoRoutes = require('./routes/photoRoutes');
const nimaRoutes = require('./routes/nimaRoutes');
const multer = require('multer');
const cors = require('cors');

// 미들웨어 설정 (CORS 및 JSON 데이터 처리)
app.use(cors());
app.use(express.json());

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // 이미지가 저장될 디렉토리
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // 파일 이름 설정
  }
});
const upload = multer({ storage });

// 사진 및 NIMA 관련 라우트 사용
app.use('/photos', photoRoutes);
app.use('/nima', nimaRoutes);

// Mongoose 연결 (MongoDB)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => {
  console.error("Error connecting to MongoDB", err);
});

// 파일 업로드 API (단일 이미지 업로드)
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded');
  }
  res.status(200).send({
    message: 'Image uploaded successfully',
    filename: req.file.filename
  });
});

// 기본 라우트
app.get('/', (req, res) => {
  res.send("Welcome to Getlery Server!");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});