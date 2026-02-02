import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = (req, res, next) => {
    try {
        //lấy token từ header
        const authHeader = req.headers['authorization'];//lấy access token từ header
        const token = authHeader && authHeader.split(' ')[1];//nếu có authHeader sẽ bởi dấu cách theo dạng (bearer-token)
        if(!token){
            return res.status(401).json({message: "Access token is required"});
        }
        //xác nhận token hơp lệ
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if(err){
                console.error(err);
                return res.status(403).json({message: "Invalid or expired access token"});
            }
            //tìm user từ token
            const user = await User.findById(decodedUser.userId).select('-hashPassword');//loại bỏ hashPassword khi trả về
            if(!user){
                return res.status(404).json({message: "User not found"});
            }

            //trả user về trong req
            req.user = user; //gán user vào req để sử dụng trong các controller tiếp theo
            next();
        });

    } catch (error) {
        console.error("Error in authMiddleware:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};