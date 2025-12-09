
// ===================================
// routes/journalEntries.js
// ===================================
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT je.*, u.username 
       FROM journal_entries je 
       JOIN users u ON je.user_id = u.id 
       WHERE je.user_id = $1 
       ORDER BY je.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch journal entries' });
  }
});

router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT je.*, u.username, u.email 
       FROM journal_entries je 
       JOIN users u ON je.user_id = u.id 
       ORDER BY je.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching all journal entries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch journal entries' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT je.*, u.username 
       FROM journal_entries je 
       JOIN users u ON je.user_id = u.id 
       WHERE je.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }

    const entry = result.rows[0];

    if (entry.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    res.json({ success: true, data: entry });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch journal entry' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO journal_entries (user_id, title, content, mood, tags) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.user.id, title, content, mood || null, tags || null]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ success: false, error: 'Failed to create journal entry' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, mood, tags } = req.body;
    
    const checkOwnership = await pool.query(
      'SELECT user_id FROM journal_entries WHERE id = $1',
      [id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }

    if (checkOwnership.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const result = await pool.query(
      `UPDATE journal_entries 
       SET title = COALESCE($1, title), 
           content = COALESCE($2, content),
           mood = COALESCE($3, mood),
           tags = COALESCE($4, tags),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [title, content, mood, tags, id]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ success: false, error: 'Failed to update journal entry' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const checkOwnership = await pool.query(
      'SELECT user_id FROM journal_entries WHERE id = $1',
      [id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }

    if (checkOwnership.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const result = await pool.query(
      'DELETE FROM journal_entries WHERE id = $1 RETURNING *',
      [id]
    );
    
    res.json({ success: true, message: 'Journal entry deleted', data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ success: false, error: 'Failed to delete journal entry' });
  }
});

module.exports = router;

