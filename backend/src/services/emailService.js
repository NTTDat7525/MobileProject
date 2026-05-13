import nodemailer from 'nodemailer';
import validator from 'validator';

// Cấu hình transporter cho gửi email
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true cho 465, false cho 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Kiểm tra định dạng email hợp lệ
 * @param {string} email - Địa chỉ email cần kiểm tra
 * @returns {boolean} - True nếu email hợp lệ
 */
export const isValidEmail = (email) => {
    return validator.isEmail(email);
};

/**
 * Gửi mã OTP xác thực email
 * @param {string} email - Địa chỉ email nhận OTP
 * @param {string} otp - Mã OTP
 * @returns {Promise} - Kết quả gửi email
 */
export const sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Mã xác thực email - Hệ thống đặt bàn',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Xác thực email của bạn</h2>
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ đặt bàn của chúng tôi. Để hoàn tất quá trình đặt bàn, vui lòng sử dụng mã xác thực sau:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
                </div>
                <p>Mã này sẽ hết hạn sau 10 phút.</p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                <p>Trân trọng,<br>Đội ngũ Hệ thống đặt bàn</p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};

/**
 * Gửi email xác nhận đặt bàn thành công
 * @param {string} email - Địa chỉ email khách hàng
 * @param {Object} booking - Thông tin đặt bàn
 * @returns {Promise} - Kết quả gửi email
 */
export const sendBookingConfirmationEmail = async (email, booking) => {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price) => {
        return Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Xác nhận đặt bàn thành công',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Đặt bàn thành công!</h2>
                <p>Chào ${booking.guestEmail},</p>
                <p>Cảm ơn bạn đã đặt bàn tại nhà hàng của chúng tôi. Dưới đây là chi tiết đặt bàn:</p>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Chi tiết đặt bàn</h3>
                    <p><strong>Mã đặt bàn:</strong> #${booking.id.slice(0, 8)}</p>
                    <p><strong>Bàn:</strong> ${booking.Table?.tableName || 'N/A'}</p>
                    <p><strong>Vị trí:</strong> ${booking.Table?.location || 'N/A'}</p>
                    <p><strong>Thời gian:</strong> ${formatDate(booking.time)}</p>
                    <p><strong>Số khách:</strong> ${booking.numberOfGuests} khách</p>
                    <p><strong>Email:</strong> ${booking.guestEmail}</p>
                    <p><strong>Điện thoại:</strong> ${booking.guestPhone}</p>
                    ${booking.specialRequests ? `<p><strong>Yêu cầu đặc biệt:</strong> ${booking.specialRequests}</p>` : ''}
                    <p><strong>Phương thức thanh toán:</strong> ${booking.PaymentMethod}</p>
                    <p><strong>Tổng tiền:</strong> ${formatPrice(booking.totalPrice)}</p>
                    <p><strong>Trạng thái:</strong> ${booking.status}</p>
                </div>

                <p>Vui lòng đến đúng giờ. Nếu có thay đổi, hãy liên hệ với chúng tôi.</p>
                <p>Trân trọng,<br>Đội ngũ Hệ thống đặt bàn</p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};