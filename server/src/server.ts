import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`🚀 CampusOptiX Backend is listening on port ${config.port} [${config.nodeEnv}]`);
  console.log(`📡 API Health Check: http://localhost:${config.port}/health`);
  console.log(`📡 REST API Endpoint: http://localhost:${config.port}/api/v1`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
