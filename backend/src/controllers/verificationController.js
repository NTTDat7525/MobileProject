import EmailVerification from '../models/EmailVerification.js';
import { isValidEmail, sendVerificationEmail } from '../services/emailService.js';

export const sendVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Định dạng email không hợp lệ'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await EmailVerification.destroy({ where: { email: normalizedEmail } });
        await EmailVerification.create({ email: normalizedEmail, otp, expiresAt });
        await sendVerificationEmail(normalizedEmail, otp);

        return res.json({
            success: true,
            message: 'Mã xác thực đã được gửi đến email của bạn'
        });
    } catch (error) {
        console.error('Lỗi gửi mã xác thực:', error);
        return res.status(500).json({
            success: false,
            message: 'Không thể gửi mã xác thực. Vui lòng thử lại.'
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();

        const verification = await EmailVerification.findOne({
            where: { email: normalizedEmail, otp }
        });

        if (!verification) {
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực không đúng'
            });
        }

        if (new Date() > verification.expiresAt) {
            await EmailVerification.destroy({ where: { email: normalizedEmail } });
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực đã hết hạn'
            });
        }

        await EmailVerification.destroy({ where: { email: normalizedEmail } });

        return res.json({
            success: true,
            message: 'Email đã được xác thực thành công'
        });
    } catch (error) {
        console.error('Lỗi xác thực OTP:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống. Vui lòng thử lại.'
        });
    }
};
