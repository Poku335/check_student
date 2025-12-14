const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');
const coursesRoutes = require('./routes/courses');
const attendanceRoutes = require('./routes/attendance');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.use((req, res, next) => {
  if (req.headers['content-type'] === 'text/plain' && req.body) {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
    }
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Attendance system backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 3000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});