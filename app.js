// D:\getlery-server\app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// 라우트 파일들
const photoRoutes = require('./routes/photoRoutes');
const nimaRoutes = require('./routes/nimaRoutes');
const userRoutes = require('./routes/userRoutes');

// 미들웨어 설정 (CORS 및 JSON 데이터 처리)
app.use(cors());
app.use(express.json());

// 사진 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // 이미지가 저장될 디렉토리
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // 파일 이름 설정
  }
});
const upload = multer({ storage });

// 라우트 설정
app.use('/photos', photoRoutes);
app.use('/nima', nimaRoutes);
app.use('/user', userRoutes);

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

// 기본 라우트
app.get('/', (req, res) => {
  res.send("Welcome to Getlery Server!");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});