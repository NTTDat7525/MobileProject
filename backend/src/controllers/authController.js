import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Sesstion.js';

const ACCESS_TOKEN_TTL = '30m'; //thời gian hết hạn của access token (thường 15 đổ lại)
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000 //14 ngày tính theo milliseconds

export const signUp = async (req, res) => {
    try {
        const{username, password, email, firstName, lastName} = req.body;//lấy thông tin từ request body

        if(!username || !password || !email || !firstName || !lastName){
            return res.status(400).json({message: "All fields are required"});
        }

        //kiểm tra username đã tồn tại chưa
        const duplicate = await User.findOne({username});//kiểm tra trong db username đã tồn tại chưa
        if(duplicate){
            return res.status(409).json({message: "Username already exists"});
        }
        //mã hóa mật khẩu
        const hashPassword = await bcrypt.hash(password, 10);//mã hóa mật khẩu (saltRounds = 10 - 2^10 số lần băm)
        //trước khi mã hóa bcrypt sẽ tự động tạo ra một chuỗi ngẫu nhiên (salt) và trộn vào mật khẩu
        
        //tạo user mới
        await User.create({
            username,
            hashPassword,
            email,
            displayName: firstName + " " + lastName
        });

        return res.sendStatus(201);//tạo thành công

    } catch (error) {
        console.error("Error in signUp:", error);
        return res.status(500).json({message: "Internal server error"});
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
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: "User or password is incorrect"});
        }

        //so sánh password input với hashPassword trong db
        const passwordCorrect = await bcrypt.compare(password, user.hashPassword);
        if(!passwordCorrect){
            return res.status(401).json({message: "User or password is incorrect"});
        }

        //nếu khớp tạo access token = JWT
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});

        //tạo refresh token = JWT
        const refreshToken = crypto.randomBytes(64).toString('hex'); //tạo chuỗi ngẫu nhiên dài 128 ký tự

        //tạo session lưu refresh token
        await Session.create({
            userId: user._id,
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
        return res.status(200).json({message: `User ${user.displayName} signed in successfully`, accessToken});

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
            await Session.deleteOne({refreshToken: token});//xóa refresh token trong session (hủy phiên đăng nhập)

            //xóa cookie
            res.clearCookie('refreshToken'); //xóa refresh token trên trình duyệt
        }

        return res.sendStatus(204); //không có nội dung trả về
    } catch (error) {
        console.error("Error in signOut:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};