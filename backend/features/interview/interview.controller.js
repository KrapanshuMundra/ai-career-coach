import * as InterviewService from './interview.service.js';

export const handleChat = async (req, res) => {
  try {
    const { history, message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ success: false, message: "Missing message or parameters." });
    }

    const aiResponseText = await InterviewService.processChat(history, message, userId);

    res.json({ success: true, data: aiResponseText });
  } catch (error) {
    console.error("Interview Route Error:", error);
    res.status(500).json({ success: false, message: "Server error during chat." });
  }
};

export const handleReport = async (req, res) => {
  try {
    const { history, userEmail, atsScore } = req.body; 

    if (!history || history.length === 0) {
      return res.status(400).json({ message: "Chat history is required." });
    }

    const reportData = await InterviewService.generateAndSendReport(history, userEmail, atsScore);
    
    res.status(200).json(reportData);
  } catch (error) {
    console.error("Report Route Error:", error);
    res.status(500).json({ message: "Failed to process interview data." });
  }
};