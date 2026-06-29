import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // We will use the Firebase User ID here
  },
  jobDescription: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
  },
  suggestions: {
    type: [String], // An array of strings
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Evaluation', evaluationSchema);