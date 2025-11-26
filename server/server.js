import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL,
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
