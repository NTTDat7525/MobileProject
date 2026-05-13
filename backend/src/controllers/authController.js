import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Sesstion.js';

const ACCESS_TOKEN_TTL = '30m'; //thời gian hết hạn của access token (thường 15 đổ lại)
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000 //14 ngày tính theo milliseconds

export const signUp = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const duplicate = await User.findOne({ where: { username } });
        if (duplicate) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            hashPassword,
            email,
            role: role && ["user", "admin"].includes(role) ? role : "user"
        });

        return res.sendStatus(201);

    } catch (error) {
        console.error("Error in signUp:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const signIn = async (req, res) => {
    try {
        //lấy thông tin từ request body
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({message: "Username and password are required"});
        }

        //lấy hashPassword từ db dựa vào username so với password input
        const user = await User.findOne({where: {username}});
        if(!user){
            return res.status(401).json({message: "User or password is incorrect"});
        }

        //so sánh password input với hashPassword trong db
        const passwordCorrect = await bcrypt.compare(password, user.hashPassword);
        if(!passwordCorrect){
            return res.status(401).json({message: "User or password is incorrect"});
        }

        //nếu khớp tạo access token = JWT
        const accessToken = jwt.sign({userId: user.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});

        //tạo refresh token = JWT
        const refreshToken = crypto.randomBytes(64).toString('hex'); //tạo chuỗi ngẫu nhiên dài 128 ký tự

        //tạo session lưu refresh token
        await Session.create({
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)//thời điểm hết hạn
        });

        //trả refresh token về cho client qua cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, //chỉ truy cập được từ phía server
            secure: true, //chỉ gửi cookie qua kết nối HTTPS
            sameSite: 'none', //cho phép fe vaf be chạy trên 2 domain khác nhau (nếu deloy trên cùng 1 domain thì để 'lax' hoặc 'strict')
            maxAge: REFRESH_TOKEN_TTL //thời gian sống của cookie
        });

        //trả access token về cho client qua response body
        const { hashPassword: _pw, ...safeUser } = user.toJSON();
        return res.status(200).json({message: `User ${user.username} signed in successfully`, accessToken, user: safeUser});

    } catch (error) {
        console.error("Error in signIn:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const signOut = async (req, res) => {
    try {
        //lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;

        if(token){
            await Session.destroy({where: {refreshToken: token}});//xóa refresh token trong session (hủy phiên đăng nhập)

            //xóa cookie
            res.clearCookie('refreshToken'); //xóa refresh token trên trình duyệt
        }

        return res.status(201).json({message: `User signed out successfully`}); //không có nội dung trả về
    } catch (error) {
        console.error("Error in signOut:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};