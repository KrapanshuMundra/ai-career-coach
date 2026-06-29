import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  transcript: [{
    role: { type: String, enum: ['ai', 'user'], required: true },
    message: { type: String, required: true }
  }],
  overallScore: {
    type: Number,
  },
  actionableFeedback: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);