import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Debug: Log the DATABASE_URL to verify it's loaded
console.log('DATABASE_URL:', process.env.DATABASE_URL);

import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.CLIENT_URL?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/favorites', favoritesRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
