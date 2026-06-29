import * as EvaluationService from './evaluation.service.js';

export const evaluateTargetResume = async (req, res) => {
  try {
    console.log("\n======================================");
    console.log("📥 Request successfully reached the controller!");
    
    const { jobDescription, userId, email } = req.body; 

    if (!req.file || !jobDescription || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields (PDF, Job Description, or User ID)." });
    }

    await EvaluationService.syncUserEmail(userId, email);

    const result = await EvaluationService.processEvaluation(req.file.buffer, jobDescription, userId);

    if (!result.success && result.isAiRejection) {
      console.log("🛑 AI rejected document:", result.message);
      return res.status(400).json({ success: false, message: result.message || "Document rejected." });
    }

    res.status(200).json({ success: true, data: result.data });

  } catch (error) {
    console.error("🔴 Critical Controller Error:", error);
    res.status(500).json({ success: false, message: "Critical Server Error: " + error.message });
  }
};

export const getEvaluationHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, message: "User identity parameters are missing." });

    const userHistory = await EvaluationService.fetchUserHistory(userId);
    res.status(200).json({ success: true, data: userHistory });
  } catch (error) {
    console.error("🔴 Error compiling history:", error);
    res.status(500).json({ success: false, message: "Server database extraction failure." });
  }
};