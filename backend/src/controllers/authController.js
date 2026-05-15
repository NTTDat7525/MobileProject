import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/User.js';
import Session from '../models/Sesstion.js';

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '30m';
const REFRESH_TOKEN_TTL = Number(process.env.REFRESH_TOKEN_TTL_MS) || 14 * 24 * 60 * 60 * 1000;

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
    maxAge: REFRESH_TOKEN_TTL
});

export const signUp = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ tên đăng nhập, email và mật khẩu'
            });
        }

        const usernameRegex = /^\S+$/;
        const passwordRegex = /^\S+$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message: 'Tên đăng nhập không được chứa khoảng trắng'
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Mật khẩu không được chứa khoảng trắng'
            });
        }

        if (String(password).length < 6) {
            return res.status(400).json({
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        const normalizedUsername = String(username).trim();
        const normalizedEmail = String(email).trim();

        const duplicate = await User.findOne({ where: { username: normalizedUsername } });
        if (duplicate) {
            return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại' });
        }

        const emailExists = await User.findOne({ where: { email: normalizedEmail } });
        if (emailExists) {
            return res.status(409).json({ message: 'Email đã tồn tại' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: normalizedUsername,
            hashPassword,
            email: normalizedEmail,
            role: role && ['user', 'admin'].includes(role) ? role : 'user'
        });

        const { hashPassword: _pw, ...safeUser } = user.toJSON();
        return res.status(201).json({ message: 'Đăng ký tài khoản thành công', user: safeUser });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

export const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).json({ message: 'Máy chủ chưa cấu hình ACCESS_TOKEN_SECRET' });
        }

        const normalizedUsername = String(username).trim().toLowerCase();
        const user = await User.findOne({ where: { username: normalizedUsername } });
        if (!user) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        const passwordCorrect = await bcrypt.compare(password, user.hashPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );
        const refreshToken = crypto.randomBytes(64).toString('hex');

        await Session.create({
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        res.cookie('refreshToken', refreshToken, getCookieOptions());

        const { hashPassword: _pw, ...safeUser } = user.toJSON();
        return res.status(200).json({
            message: 'Đăng nhập thành công',
            accessToken,
            user: safeUser
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

export const signOut = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            await Session.destroy({ where: { refreshToken: token } });
            res.clearCookie('refreshToken', getCookieOptions());
        }

        return res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        console.error('Lỗi đăng xuất:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

const getAvailableUsername = async (baseUsername) => {
    const users = await User.findAll({
        where: { username: { [Op.like]: `${baseUsername}%` } },
        attributes: ['username'],
    });
    const used = new Set(users.map((user) => user.username));
    if (!used.has(baseUsername)) return baseUsername;

    let index = 1;
    while (used.has(`${baseUsername}${index}`)) {
        index += 1;
    }
    return `${baseUsername}${index}`;
};
