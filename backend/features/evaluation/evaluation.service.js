import User from '../users/user.model.js';                 
import Evaluation from './evaluation.model.js'; 
import { parsePdf } from '../../utils/pdfParser.js'; 
import { evaluateResume } from '../../services/aiService.js';

export const syncUserEmail = async (userId, email) => {
  if (!email) return;
  try {
    await User.findOneAndUpdate(
      { userId: userId },
      { email: email },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`👤 User profile synced for ID: ${userId}`);
  } catch (dbError) {
    console.error("⚠️ Database User Sync Error:", dbError.message);
  }
};

export const processEvaluation = async (fileBuffer, jobDescription, userId) => {
  console.log("📄 Parsing PDF document...");
  const resumeText = await parsePdf(fileBuffer);

  console.log("🧠 Sending to AI for evaluation...");
  let rawAiResponse = await evaluateResume(resumeText, jobDescription);
  let aiResult;
  
  if (typeof rawAiResponse === 'string') {
    const cleanedResponse = rawAiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    aiResult = JSON.parse(cleanedResponse);
  } else {
    aiResult = rawAiResponse;
  }

  // AI Bouncer Check
  if (aiResult.isValid === false) {
    return { success: false, isAiRejection: true, message: aiResult.error };
  }

  console.log("💾 Saving Evaluation to MongoDB...");
  const newEvaluation = new Evaluation({
    userId: userId, 
    jobDescription: jobDescription,
    atsScore: Number(aiResult.atsScore) || 0, 
    suggestions: Array.isArray(aiResult.suggestions) ? aiResult.suggestions : ["No specific suggestions provided."]
  });
  
  await newEvaluation.save();
  console.log("✅ Evaluation metrics committed safely!");

  return { success: true, data: aiResult };
};

export const fetchUserHistory = async (userId) => {
  return await Evaluation.find({ userId: userId }).sort({ createdAt: -1 });
};