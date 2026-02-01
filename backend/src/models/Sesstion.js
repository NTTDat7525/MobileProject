import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',//liên kết với model User
            required: true,
            index: true//tạo index để tìm kiếm nhanh hơn
        },
        refreshToken:{
            type: String,
            required: true,
            unique: true//mỗi refresh token là duy nhất
        },

        expiresAt:{//thời điểm refreshToken hết hạn
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true //tự động thêm createdAt và updatedAt
    }
);

sessionSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});//tự động xóa document khi đến thời điểm expiresAt

export default mongoose.model('Session', sessionSchema);//lưu thông tin phiên đăng nhập