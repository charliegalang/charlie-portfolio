import express from 'express';
import { connectDB } from './config/database.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Increase request size limits for large videos - MUST come before routes
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Allow CORS from multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://designs.ronmedina.cc',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy restriction'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});

server.timeout = 600000;
server.keepAliveTimeout = 600000;
server.headersTimeout = 601000;



