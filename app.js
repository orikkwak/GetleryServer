// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// 환경 변수 로드
dotenv.config();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

require('./work/controllers/scheduledTasks'); // 스케줄링 작업 로드

const userRoutes = require(path.join(__dirname, 'work/routes/userRoutes'));
const imageRoutes = require(path.join(__dirname, 'work/routes/imageRoutes'));
const nimaRoutes = require(path.join(__dirname, 'work/routes/nimaRoutes'));
const groupRoutes = require(path.join(__dirname, 'work/routes/groupRoutes'));

// Express 앱 설정
const app = express();
const PORT = process.env.PORT || 5000; // 기본 포트 설정

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 라우트 설정
app.use('/photos', imageRoutes);
app.use('/users', userRoutes);
app.use('/nima', nimaRoutes);
app.use('/groups', groupRoutes);

// Mongoose 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB", err));

// 서버 실행
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
