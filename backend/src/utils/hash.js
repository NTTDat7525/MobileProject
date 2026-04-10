import bcrypt from 'bcrypt';

//hash mật khẩu đăng kí
export const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
}

//so sánh mật khẩu đăng nhập vs mật khẩu trong database
export const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
}