import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDB } from './db/connect.js';
import { apiRouter, redirectRouter } from './routes/urlRoutes.js';

const app = express();
const port = process.env.PORT || 3000;
const mongoUri =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/zetatube';

// Basic middleware
app.set('trust proxy', 1);
app.use(express.json());

// // Health endpoint
// app.get('/api/v1/health', (_req, res) => {
//   res.json({ status: 'ok', service: 'ZetaTube API', version: 'v1' });
// });

// API routes (create links)
app.use('/api/v1', apiRouter);

// Public redirect route for short codes
app.use('/', redirectRouter);

async function start() {
  try {
    await connectDB(mongoUri);
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
