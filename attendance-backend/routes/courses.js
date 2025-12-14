const express = require('express');
const { dbRun, dbGet, dbAll } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = await dbAll('SELECT * FROM courses ORDER BY course_code');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { course_code, course_name, description } = req.body;
    
    const existingCourse = await dbGet('SELECT * FROM courses WHERE course_code = ?', [course_code]);
    if (existingCourse) {
      return res.status(400).json({ error: 'Course code already exists' });
    }
    
    const result = await dbRun(
      'INSERT INTO courses (course_code, course_name, description) VALUES (?, ?, ?)',
      [course_code, course_name, description || '']
    );
    
    const newCourse = await dbGet('SELECT * FROM courses WHERE id = ?', [result.id]);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { course_code, course_name, description } = req.body;
    
    const existingCourse = await dbGet('SELECT * FROM courses WHERE course_code = ? AND id != ?', [course_code, id]);
    if (existingCourse) {
      return res.status(400).json({ error: 'Course code already exists' });
    }
    
    const result = await dbRun(
      'UPDATE courses SET course_code = ?, course_name = ?, description = ? WHERE id = ?',
      [course_code, course_name, description || '', id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const updatedCourse = await dbGet('SELECT * FROM courses WHERE id = ?', [id]);
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await dbGet('SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    await dbRun('DELETE FROM courses WHERE id = ?', [id]);
    
    res.json({ message: 'Course deleted successfully', course: course });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

router.get('/:courseId/students', async (req, res) => {
  try {
    const { courseId } = req.params;
    const students = await dbAll(`
      SELECT s.*, ce.enrolled_at
      FROM students s
      JOIN course_enrollments ce ON s.student_id = ce.student_id
      WHERE ce.course_id = ?
      ORDER BY s.fullname
    `, [courseId]);
    res.json(students);
  } catch (error) {
    console.error('Error fetching course students:', error);
    res.status(500).json({ error: 'Failed to fetch course students' });
  }
});

router.post('/:courseId/enroll', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { student_id } = req.body;
    
    const student = await dbGet('SELECT * FROM students WHERE student_id = ?', [student_id]);
    const course = await dbGet('SELECT * FROM courses WHERE id = ?', [courseId]);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const existing = await dbGet('SELECT * FROM course_enrollments WHERE student_id = ? AND course_id = ?', [student_id, courseId]);
    if (existing) {
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }
    
    await dbRun('INSERT INTO course_enrollments (student_id, course_id) VALUES (?, ?)', [student_id, courseId]);
    
    res.json({ message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ error: 'Failed to enroll student' });
  }
});

router.delete('/:courseId/students/:studentId', async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    const result = await dbRun('DELETE FROM course_enrollments WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    res.json({ message: 'Student unenrolled successfully' });
  } catch (error) {
    console.error('Error unenrolling student:', error);
    res.status(500).json({ error: 'Failed to unenroll student' });
  }
});

module.exports = router;