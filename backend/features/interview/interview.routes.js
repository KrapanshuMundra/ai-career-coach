import express from 'express';
import * as InterviewController from './interview.controller.js';

const router = express.Router();

router.post('/chat', InterviewController.handleChat);
router.post('/report', InterviewController.handleReport);

export default router;