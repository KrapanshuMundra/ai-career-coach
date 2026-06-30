import { Resend } from 'resend';
import dotenv from 'dotenv';
import { generateInterviewReportTemplate } from '../templates/emailTemplates.js';

dotenv.config();

// 1. Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// NOTE: 'onboarding@resend.dev' only works for sending to your own
// Resend account email. Once you verify a custom domain in Resend,
// replace this with something like 'noreply@yourdomain.com' so you
// can send to any user.
const FROM_ADDRESS = 'CareerCoach <onboarding@resend.dev>';

// 2. Execution Function
export const sendReportEmail = async (targetEmail, reportData, atsScore) => {
  try {
    const htmlContent = generateInterviewReportTemplate(reportData, atsScore);

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: targetEmail,
      subject: `Your Career Readiness Score: ${reportData.overallScore}/100 🚀`,
      html: htmlContent,
    });

    if (error) {
      console.error("[Email Service] Failed to send report:", error);
      throw new Error("Failed to dispatch email notification.");
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("[Email Service] Failed to send report:", error);
    throw new Error("Failed to dispatch email notification.");
  }
};

export const sendOTPEmail = async (targetEmail, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CareerCoach Security <onboarding@resend.dev>',
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
    });

    if (error) {
      console.error("Failed to send OTP email:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
};