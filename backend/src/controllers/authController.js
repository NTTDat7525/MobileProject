import * as authService from '../services/authService.js'

export const register = async(req, res) => {
    try {
        const {id, username, password, email} = req.body;
        await authService.register(id, username, password, email)
        res.json({message: "Đăng ký thành công"})
    } catch (err) {
        res.status(400).json({message: "Lỗi: " + err.message})
    }
}

export const signUp = (req, res) => {
    res.send("Đăng ký thành công");
}

export const signOut = (req, res) => {
    res.send("Đăng xuất thành công");
}