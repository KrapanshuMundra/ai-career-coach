import express from 'express';
import * as AuthController from './auth.controller.js';

const router = express.Router();

router.post('/send-otp', AuthController.sendOTP);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/register', AuthController.registerUser);

export default router;