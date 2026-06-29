import express from 'express';
import multer from 'multer';
import * as EvaluationController from './evaluation.controller.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("SECURITY BLOCK: Only PDF files are permitted."));
    }
  }
});

const uploadMiddleware = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      console.error("🔴 MULTER FILE UPLOAD ERROR:", err);
      return res.status(500).json({ success: false, message: "File upload rejected: " + err.message });
    }
    next();
  });
};

router.post('/evaluate', uploadMiddleware, EvaluationController.evaluateTargetResume);
router.get('/history/:userId', EvaluationController.getEvaluationHistory);

export default router;