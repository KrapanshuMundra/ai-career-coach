import bcrypt from 'bcryptjs';
import User from '../users/user.model.js'; 
import OTP from './otp.model.js'; 
import { sendOTPEmail } from '../../services/emailService.js';

export const processAndSendOTP = async (email) => {
  // 1. Generate 6-digit code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Clean up old OTPs to prevent conflicts
  await OTP.deleteMany({ email });

  // 3. Save new OTP
  await OTP.create({ email, otp: otpCode });

  // 4. Send Email
  const emailSent = await sendOTPEmail(email, otpCode);
  return emailSent;
};

export const validateOTP = async (email, otp) => {
  // Find exact match
  const existingOtp = await OTP.findOne({ email, otp });
  
  if (!existingOtp) {
    return false; // Invalid or expired
  }

  // Valid! Delete it so it cannot be reused
  await OTP.deleteOne({ _id: existingOtp._id });
  return true;
};

export const registerNewUser = async (userId, email, password) => {
  // 1. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 2. Upsert the profile
  const profile = await User.findOneAndUpdate(
    { userId: userId },
    { email: email, password: hashedPassword },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`👤 New identity footprint logged into users collection matching ID: ${userId}`);
  return profile;
};