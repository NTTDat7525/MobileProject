import * as userQuery from "../db/queries/userQuery";
import { hashPassword, comparePassword } from "../utils/hash";

export const register = async (id, username, password, email) => {
    const hashed = await hashPassword(password)
    return userQuery.createUser(id, username, hashed, email)
}

export const login = async (username, password) => {
    const [rows] = await userQuery.getUserByUsername(username);
    if (rows.length === 0) {
        throw new Error("User không tồn tại");
    }
    const user = rows[0];
    const isMatch = await comparePassword(password, user.hashPassword);
    if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
    }
    return user;
}