import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', userRoutes);

// Health check endpoint (protected)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), message: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});