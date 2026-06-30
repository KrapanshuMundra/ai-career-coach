import Evaluation from '../evaluation/evaluation.model.js';
import { generateInterviewResponse, generateInterviewReport } from '../../services/aiService.js';
import { sendReportEmail } from '../../services/emailService.js';

export const processChat = async (history, message, userId) => {
  // 🪐 MONGO FETCH: Grab the latest analysis data
  const userEvaluationData = await Evaluation.findOne({ userId }).sort({ createdAt: -1 });

  let extractedResumeText = "No resume details loaded.";
  let targetedJobDescription = "General technical interview query context.";

  if (userEvaluationData) {
    targetedJobDescription = userEvaluationData.jobDescription;
    extractedResumeText = `Target Position Requirements Context: ${userEvaluationData.jobDescription}. Optimization Recommendations: ${userEvaluationData.suggestions.join(', ')}`;
  }

  // Pass data down to AI runtime
  return await generateInterviewResponse(history || [], message, extractedResumeText, targetedJobDescription);
};

export const generateAndSendReport = async (history, userEmail, atsScore) => {
  const reportData = await generateInterviewReport(history);
  
  // Email sending disable for now 
  // if (userEmail) {
  //   // Dispatch email asynchronously without holding up the return statement
  //   sendReportEmail(userEmail, reportData, atsScore).catch(err => 
  //     console.error("Non-fatal error: Email dispatch failed in background:", err)
  //   );
  // }
  
  return reportData;
};