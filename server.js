import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDB } from './db/connect.js';

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URL;

// Basic middleware
app.use(express.json());

// Health endpoint
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ZetaTube API', version: 'v1' });
});

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
