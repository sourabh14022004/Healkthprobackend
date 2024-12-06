import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import qrRoutes from './routes/qr.routes';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/qr', qrRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});