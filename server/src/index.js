import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { isCloudinaryConfigured } from './config/cloudinary.js';

import authRoutes from './routes/auth.js';
import riderRoutes from './routes/riders.js';
import mediaRoutes from './routes/media.js';
import rideRoutes from './routes/rides.js';
import messageRoutes from './routes/messages.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, cloudinary: isCloudinaryConfigured() }),
);

app.use('/api/auth', authRoutes);
app.use('/api/riders', riderRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/messages', messageRoutes);

// Multer / generic error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 400).json({ error: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🏍  Parijaiyi API running on http://localhost:${PORT}`);
    if (!isCloudinaryConfigured())
      console.warn('⚠  Cloudinary not configured — image/video uploads will be rejected.');
  });
});
