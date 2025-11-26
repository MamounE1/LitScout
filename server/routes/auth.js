import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import passport from '../config/passport.js';
import pool from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').trim().isLength({ min: 3 }),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, password } = req.body;

  try {
    const existing = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username',
      [email, username, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', 
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res.json({ 
      token, 
      user: { 
        id: req.user.id, 
        email: req.user.email, 
        username: req.user.username 
      } 
    });
  }
);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
