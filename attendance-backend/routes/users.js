const express = require('express');
const bcrypt = require('bcryptjs');
const { dbRun, dbGet, dbAll } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await dbAll('SELECT id, username, fullname, created_at FROM users ORDER BY fullname');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await dbGet('SELECT id, username, fullname, created_at FROM users WHERE id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, fullname, password } = req.body;
    
    const existingUser = await dbGet('SELECT * FROM users WHERE username = ? AND id != ?', [username, id]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    let updateQuery = 'UPDATE users SET username = ?, fullname = ? WHERE id = ?';
    let params = [username, fullname, id];
    
    if (password && password.trim()) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      updateQuery = 'UPDATE users SET username = ?, fullname = ?, password_hash = ? WHERE id = ?';
      params = [username, fullname, passwordHash, id];
    }
    
    const result = await dbRun(updateQuery, params);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updatedUser = await dbGet('SELECT id, username, fullname, created_at FROM users WHERE id = ?', [id]);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await dbGet('SELECT id, username, fullname FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await dbRun('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ message: 'User deleted successfully', user: user });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;