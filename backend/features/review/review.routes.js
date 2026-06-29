import express from 'express';
import Review from './review.model.js'; // 👈 Note the .js extension!

const router = express.Router();

// POST: Save a new user review
router.post('/submit', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required." });
    }

    const newReview = new Review({
      userId,
      rating,
      comment
    });

    await newReview.save();
    
    res.status(201).json({ success: true, message: "Review saved successfully!" });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ success: false, message: "Failed to submit review." });
  }
});

export default router;