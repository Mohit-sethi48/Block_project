import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';
import ensureSchema from './config/ensureSchema.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import listRoutes from './routes/listRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const host = process.env.HOST || '0.0.0.0';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5000,http://127.0.0.1:5000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Server and database are running.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lists', listRoutes);
app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  return res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const startServer = async () => {
  try {
    await ensureSchema();

    app.listen(port, host, () => {
      console.log(`Backend server running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Unable to start backend server:', error.message);
    console.error(
      'Check that MySQL is running and that backend/.env has correct DB_HOST, DB_USER, DB_PASSWORD and DB_NAME values.'
    );
    process.exit(1);
  }
};

startServer();
