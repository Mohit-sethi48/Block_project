import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import listRoutes from './routes/listRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Server and database are running.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lists', listRoutes);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
