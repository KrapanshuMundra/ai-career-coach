import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import evaluationRoutes from './features/evaluation/evaluation.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import interviewRoutes from './features/interview/interview.routes.js';
import reviewRoutes from './features/review/review.routes.js'
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 🛡️ MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true })); 

// ==========================================
// 🛣️ ROUTES
// ==========================================
app.use('/api/upload', evaluationRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('AI Career Coach Backend is Running!');
});

// ==========================================
// 🚨 GLOBAL ERROR CATCHER (THE MISSING PIECE)
// Catches silent middleware crashes (like bad JSON/FormData parsing)
// ==========================================
app.use((err, req, res, next) => {
  console.error("🔴 GLOBAL SERVER ERROR:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// Connect to MongoDB, THEN start the server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on Port:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });