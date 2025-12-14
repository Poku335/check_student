const express = require('express');
const { dbRun, dbGet, dbAll } = require('../config/database');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { student_id, course_id, event_type } = req.body;
    
    const student = await dbGet('SELECT * FROM students WHERE student_id = ?', [student_id]);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const enrollment = await dbGet('SELECT * FROM course_enrollments WHERE student_id = ? AND course_id = ?', [student_id, course_id]);
    if (!enrollment) {
      return res.status(400).json({ error: 'Student not enrolled in this course' });
    }

    const now = new Date();
    const currentDate = now.toLocaleDateString('sv-SE');
    const currentTimestamp = now.toISOString();

    const result = await dbRun(
      'INSERT INTO attendance_events (student_id, course_id, event_type, date, timestamp) VALUES (?, ?, ?, ?, ?)',
      [student_id, course_id, event_type, currentDate, currentTimestamp]
    );
    
    const newAttendance = await dbGet('SELECT * FROM attendance_events WHERE id = ?', [result.id]);
    
    res.status(201).json({
      message: 'Attendance recorded successfully',
      attendance: newAttendance
    });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

router.delete('/reset/:studentId/:courseId', async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const today = new Date().toISOString().split('T')[0];
    
    const result = await dbRun(
      'DELETE FROM attendance_events WHERE student_id = ? AND course_id = ? AND DATE(timestamp) = ?',
      [studentId, courseId, today]
    );
    
    res.json({ 
      message: 'Attendance reset successfully', 
      deletedRecords: result.changes 
    });
  } catch (error) {
    console.error('Error resetting attendance:', error);
    res.status(500).json({ error: 'Failed to reset attendance' });
  }
});

router.delete('/reset-all/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const today = new Date().toISOString().split('T')[0];
    
    const result = await dbRun(
      'DELETE FROM attendance_events WHERE course_id = ? AND DATE(timestamp) = ?',
      [courseId, today]
    );
    
    res.json({ 
      message: 'All attendance reset successfully', 
      deletedRecords: result.changes 
    });
  } catch (error) {
    console.error('Error resetting all attendance:', error);
    res.status(500).json({ error: 'Failed to reset all attendance' });
  }
});

router.get('/debug', async (req, res) => {
  try {
    const query = `
      SELECT ae.*, s.fullname, c.course_code, c.course_name,
             DATE(ae.timestamp) as date_only,
             TIME(ae.timestamp) as time_only
      FROM attendance_events ae 
      JOIN students s ON ae.student_id = s.student_id 
      LEFT JOIN courses c ON ae.course_id = c.id
      ORDER BY ae.timestamp DESC
      LIMIT 20
    `;
    
    const allRecords = await dbAll(query);
    res.json(allRecords);
  } catch (error) {
    console.error('Error fetching debug data:', error);
    res.status(500).json({ error: 'Failed to fetch debug data' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { student_id, date, course_id } = req.query;
    
    let query = `
      SELECT ae.*, s.fullname, c.course_code, c.course_name
      FROM attendance_events ae 
      JOIN students s ON ae.student_id = s.student_id 
      LEFT JOIN courses c ON ae.course_id = c.id
      WHERE 1=1
    `;
    const params = [];
    
    if (student_id) {
      params.push(student_id);
      query += ` AND ae.student_id = ?`;
    }
    
    if (date) {
      params.push(date);
      query += ` AND DATE(ae.timestamp) = ?`;
    }
    
    if (course_id) {
      params.push(course_id);
      query += ` AND ae.course_id = ?`;
    }
    
    query += ' ORDER BY ae.timestamp DESC';
    
    const history = await dbAll(query, params);
    res.json(history);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
});

module.exports = router;