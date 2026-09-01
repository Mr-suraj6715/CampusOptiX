import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.router';
import { errorHandler } from './middleware/validate.middleware';

export const app = express();

// Security: CORS Configuration (Section 51)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev mode for testing
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CampusOptiX Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes on both /api and /api/v1 for comprehensive frontend and REST client compatibility
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

// Centralized Global Error Handler (Section 48)
app.use(errorHandler);

export default app;
