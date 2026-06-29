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
  } catch (dbError) {
    console.error("⚠️ Database User Sync Error:", dbError.message);
  }
};

export const processEvaluation = async (fileBuffer, jobDescription, userId) => {
  const resumeText = await parsePdf(fileBuffer);
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
  const newEvaluation = new Evaluation({
    userId: userId, 
    jobDescription: jobDescription,
    atsScore: Number(aiResult.atsScore) || 0, 
    suggestions: Array.isArray(aiResult.suggestions) ? aiResult.suggestions : ["No specific suggestions provided."]
  });
  
  await newEvaluation.save();
  return { success: true, data: aiResult };
};

export const fetchUserHistory = async (userId) => {
  return await Evaluation.find({ userId: userId }).sort({ createdAt: -1 });
};