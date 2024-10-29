// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 라우트 임포트
const photoRoutes = require('./routes/photoRoutes');
const userRoutes = require('./routes/userRoutes');
const nimaRoutes = require('./routes/nimaRoutes');
const groupRoutes = require('./routes/groupRoutes'); // 필요 시 추가

dotenv.config(); // .env 파일에 환경 변수 로드

const app = express();
const PORT = process.env.PORT || 5000; // 기본 포트 설정

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 라우트 설정
app.use('/photos', photoRoutes);
app.use('/users', userRoutes);
app.use('/nima', nimaRoutes);
app.use('/groups', groupRoutes); // 필요 시 추가

// Mongoose 연결
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB", err));

// 서버 실행
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
