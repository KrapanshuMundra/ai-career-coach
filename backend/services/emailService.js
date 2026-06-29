import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateInterviewReportTemplate } from '../templates/emailTemplates.js';

dotenv.config();

// 1. Initialize the Transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Email Transporter Error:", error);
  } else {
    console.log("Email Transporter Ready");
  }
});

// 3. Execution Function
// Add atsScore as the third parameter
export const sendReportEmail = async (targetEmail, reportData, atsScore) => {
  try {
    // Pass atsScore into the template function
    const htmlContent = generateInterviewReportTemplate(reportData, atsScore);

    const mailOptions = {
      from: `"CareerCoach AI" <${process.env.EMAIL_USER}>`,
      to: targetEmail,
      subject: `Your Career Readiness Score: ${reportData.overallScore}/100 🚀`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Email Service] Failed to send report:", error);
    throw new Error("Failed to dispatch email notification.");
  }
};
export const sendOTPEmail = async (targetEmail, otp) => {
  try {
    const mailOptions = {
      from: `"CareerCoach Security" <${process.env.EMAIL_USER}>`,
      to: targetEmail,
      subject: `Your CareerCoach Verification Code: ${otp}`,
      html: `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #6A0DAD; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900;">CareerCoach</h1>
          </div>
          <div style="padding: 32px; text-align: center;">
            <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Verify your email address</h2>
            <p style="color: #4b5563; font-size: 15px; margin-bottom: 32px;">Please use the following 6-digit verification code to complete your registration. This code is valid for 5 minutes.</p>
            
            <div style="background-color: #f9fafb; border: 1px dashed #cbd5e1; padding: 16px; border-radius: 12px; margin-bottom: 32px;">
              <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #6A0DAD;">${otp}</span>
            </div>
            
            <p style="color: #9ca3af; font-size: 13px; margin: 0;">If you didn't request this code, you can safely ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
};