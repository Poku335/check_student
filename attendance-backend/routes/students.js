const express = require('express');
const { dbRun, dbGet, dbAll } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const students = await dbAll('SELECT * FROM students ORDER BY fullname');
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, fullname, email } = req.body;
    await dbRun(
      'INSERT INTO students (student_id, fullname, email) VALUES (?, ?, ?)',
      [student_id, fullname, email]
    );
    
    const newStudent = await dbGet('SELECT * FROM students WHERE student_id = ?', [student_id]);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email } = req.body;
    
    const result = await dbRun(
      'UPDATE students SET fullname = ?, email = ? WHERE student_id = ?',
      [fullname, email, id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const updatedStudent = await dbGet('SELECT * FROM students WHERE student_id = ?', [id]);
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await dbGet('SELECT * FROM students WHERE student_id = ?', [id]);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    await dbRun('DELETE FROM students WHERE student_id = ?', [id]);
    
    res.json({ message: 'Student deleted successfully', student: student });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

router.get('/:studentId/courses', async (req, res) => {
  try {
    const { studentId } = req.params;
    const courses = await dbAll(`
      SELECT c.*, ce.enrolled_at
      FROM courses c
      JOIN course_enrollments ce ON c.id = ce.course_id
      WHERE ce.student_id = ?
      ORDER BY c.course_code
    `, [studentId]);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ error: 'Failed to fetch student courses' });
  }
});

module.exports = router;