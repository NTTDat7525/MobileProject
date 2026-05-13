import { v4 as uuidv4 } from 'uuid';
import EmailVerification from '../models/EmailVerification.js';
import { isValidEmail, sendVerificationEmail } from '../services/emailService.js';

/**
 * Tạo và gửi mã OTP xác thực email
 */
export const sendVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra định dạng email
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Định dạng email không hợp lệ'
            });
        }

        // Tạo mã OTP 6 chữ số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Thời gian hết hạn: 10 phút
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Xóa mã OTP cũ nếu có
        await EmailVerification.destroy({ where: { email } });

        // Lưu mã OTP mới
        await EmailVerification.create({
            email,
            otp,
            expiresAt
        });

        // Gửi email
        await sendVerificationEmail(email, otp);

        res.json({
            success: true,
            message: 'Mã xác thực đã được gửi đến email của bạn'
        });

    } catch (error) {
        console.error('Lỗi gửi mã xác thực:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể gửi mã xác thực. Vui lòng thử lại.'
        });
    }
};

/**
 * Xác thực mã OTP
 */
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Tìm mã OTP trong database
        const verification = await EmailVerification.findOne({
            where: { email, otp }
        });

        if (!verification) {
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực không đúng'
            });
        }

        // Kiểm tra thời gian hết hạn
        if (new Date() > verification.expiresAt) {
            // Xóa mã OTP hết hạn
            await EmailVerification.destroy({ where: { email } });
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực đã hết hạn'
            });
        }

        // Xóa mã OTP sau khi xác thực thành công
        await EmailVerification.destroy({ where: { email } });

        res.json({
            success: true,
            message: 'Email đã được xác thực thành công'
        });

    } catch (error) {
        console.error('Lỗi xác thực OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống. Vui lòng thử lại.'
        });
    }
};