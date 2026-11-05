import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🌲 Hidden Haryana Server running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`⚡ API Health: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    // Connect to database in parallel without blocking initial HTTP requests
    connectDB().catch((err) => {
      console.warn(`[Database] Initial connection attempt: ${err.message}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated.');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
