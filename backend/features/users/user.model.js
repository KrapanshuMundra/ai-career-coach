import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // Prevents duplicate profiles for the same account
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String, // <-- Stores the secure, hashed string signature
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('User', userSchema);