require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// 라우트 파일들
const photoRoutes = require('./work/routes/photoRoutes');
const nimaRoutes = require('./work/routes/nimaRoutes');
const userRoutes = require('./work/routes/userRoutes');

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우트 설정
app.use('/photos', photoRoutes);
app.use('/nima', nimaRoutes);
app.use('/user', userRoutes);

// Mongoose 연결
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
