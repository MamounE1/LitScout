import express from 'express';
import pool from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT book_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows.map(row => row.book_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:bookId', authenticateToken, async (req, res) => {
  const { bookId } = req.params;

  try {
    await pool.query(
      'INSERT INTO favorites (user_id, book_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, bookId]
    );
    res.json({ message: 'Book added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:bookId', authenticateToken, async (req, res) => {
  const { bookId } = req.params;

  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND book_id = $2',
      [req.user.id, bookId]
    );
    res.json({ message: 'Book removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
