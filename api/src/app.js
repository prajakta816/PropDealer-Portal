import express from 'express';
import usersRouter from './modules/users/users.routes.js';
import { prisma } from '../prisma/prisma.js';

const app = express();

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'hello world',
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'server running successfully',
  });
});

// Database health check
app.get('/api/health/db', async (req, res) => {
  try {
    const users = await prisma.$queryRaw`SELECT 1 AS connected`;

    res.status(200).json({
      status: 'success',
      message: 'Database connectivity successful',
      data: users,
    });
  } catch (error) {
    console.error('Database connectivity failed:', error);

    res.status(503).json({
      status: 'error',
      message: 'Database connectivity failed',
    });
  }
});

// User routes
app.use('/api/users', usersRouter);

export default app;