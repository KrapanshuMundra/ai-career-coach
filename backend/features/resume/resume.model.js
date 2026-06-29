import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetJobRole: {
    type: String,
    required: true,
  },
  originalText: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    default: 0,
  },
  aiSuggestions: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);