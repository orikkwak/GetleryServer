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

// 미들웨어 설정 (JSON 데이터 처리)
app.use(express.json());

// 사진 및 NIMA 관련 라우트 사용
app.use('/photos', photoRoutes);
app.use('/nima', nimaRoutes);

// Mongoose 연결 (MongoDB)
mongoose.connect(process.env.MONGO_URI, {
  //useNewUrlParser: true,
  //useUnifiedTopology: true
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
