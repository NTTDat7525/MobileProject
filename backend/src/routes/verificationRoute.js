import express from 'express';
import { sendVerificationOTP, verifyOTP } from '../controllers/verificationController.js';

const router = express.Router();

// Route gửi mã OTP xác thực email
router.post('/send-otp', sendVerificationOTP);

// Route xác thực mã OTP
router.post('/verify-otp', verifyOTP);

export default router;