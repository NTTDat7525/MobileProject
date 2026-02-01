import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        username:{
            type: String,
            required: true,//bắt buộc phải có
            unique: true,//độc nhất
            trim: true,//xóa khoảng trắng thừa
            lowercase: true//chuyển về chữ thường
        },

        hashPassword:{
            type: String,
            required: true
        },

        email:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        displayName:{//tên hiển thị
            type: String,
            required: true,
            trim: true
        },

        bio:{
            type: String,
            maxlenghth: 500,
            default: ""
        },

        phone:{
            type: String,
            trim: true,
            sparse: true//cho phép null và unique
        }
    }, 

    {//cấu hình
        timestamps: true//tự động tạo createdAt và updatedAt
});

const User = mongoose.model('User', userSchema);

export default User;//lưu thông tin user