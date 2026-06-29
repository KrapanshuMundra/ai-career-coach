import * as AuthService from './auth.service.js';

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    const emailSent = await AuthService.processAndSendOTP(email);
    
    if (emailSent) {
      res.status(200).json({ success: true, message: "OTP sent successfully." });
    } else {
      res.status(500).json({ success: false, message: "Failed to send email." });
    }
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required." });

    const isValid = await AuthService.validateOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    res.status(200).json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { userId, email, password } = req.body;

    if (!userId || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing parameter details." });
    }

    const profile = await AuthService.registerNewUser(userId, email, password);
    res.status(201).json({ success: true, user: profile });

  } catch (error) {
    console.error("Authentication Entry Synchronization Failure:", error);
    res.status(500).json({ success: false, message: "Internal server registry breakdown." });
  }
};