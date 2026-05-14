import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return res.status(401).json({ message: 'Vui lòng đăng nhập' });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
            }

            const user = await User.findByPk(decodedUser.userId, {
                attributes: { exclude: ['hashPassword'] }
            });

            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            req.user = user;
            return next();
        });
    } catch (error) {
        console.error('Lỗi middleware xác thực:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
