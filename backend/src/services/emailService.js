import nodemailer from 'nodemailer';
import validator from 'validator';

const getMailConfig = () => ({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_ENCRYPTION === 'ssl' || process.env.MAIL_PORT === '465',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const getFromAddress = () => {
    const address = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME;
    const name = process.env.MAIL_FROM_NAME || 'Golden Spoons';
    return `"${name}" <${address}>`;
};

const canSendMail = () =>
    Boolean(process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD);

const sendMail = async (mailOptions) => {
    if (!canSendMail()) {
        const missing = ['MAIL_HOST', 'MAIL_USERNAME', 'MAIL_PASSWORD']
            .filter((key) => !process.env[key])
            .join(', ');
        console.warn(`Chưa cấu hình email, bỏ qua gửi email. Thiếu biến: ${missing}`);
        return null;
    }

    const transporter = nodemailer.createTransport(getMailConfig());
    return transporter.sendMail({ from: getFromAddress(), ...mailOptions });
};

export const isValidEmail = (email) => validator.isEmail(String(email || ''));

export const sendVerificationEmail = async (email, otp) => {
    return sendMail({
        to: email,
        subject: 'Mã xác thực email - Golden Spoons',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Xác thực email của bạn</h2>
                <p>Chào bạn,</p>
                <p>Vui lòng sử dụng mã xác thực sau để hoàn tất thao tác:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
                </div>
                <p>Mã này sẽ hết hạn sau 10 phút.</p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
                <p>Trân trọng,<br>Golden Spoons</p>
            </div>
        `
    });
};

export const sendBookingConfirmationEmail = async (email, booking) => {
    const customerName = booking.User?.username || booking.guestName || booking.guestEmail || 'Quý khách';
    const tableLabel = booking.Table?.tableName || booking.tableName || 'N/A';

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const formatPrice = (price) =>
        Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return sendMail({
        to: email,
        subject: 'Xác nhận đặt bàn thành công',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Đặt bàn thành công!</h2>
                <p>Chào ${customerName},</p>
                <p>Cảm ơn bạn đã đặt bàn tại Golden Spoons. Dưới đây là chi tiết đặt bàn:</p>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Chi tiết đặt bàn</h3>
                    <p><strong>Mã đặt bàn:</strong> #${booking.id.slice(0, 8)}</p>
                    <p><strong>Khách hàng:</strong> ${customerName}</p>
                    <p><strong>Bàn:</strong> ${tableLabel}</p>
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
                <p>Trân trọng,<br>Golden Spoons</p>
            </div>
        `
    });
};
