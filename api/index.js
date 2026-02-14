import express from 'express';
import cors from 'cors';
import authRoutes from '../backend/src/routes/auth';
import postRoutes from '../backend/src/routes/posts';
import notificationRoutes from '../backend/src/routes/notifications';
import { connectDB } from '../backend/src/config/db';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;
