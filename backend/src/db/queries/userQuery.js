import pool from '../connection.js';


//lấy thông tin user hiện tại
export const getCurrentUser = async (id) => {
    const [rows] = await pool.execute(
        "SELECT * FROM Users WHERE id = ?",
        [id]
    );
    return rows[0];
};

//tạo user mới
export const createUser = async (user) => {
    const query = `
        INSERT INTO Users (id, username, hashPassword, email)
        VALUES (?, ?, ?, ?)
    `;
    await pool.execute(query, [
        user.id,
        user.username,
        user.hashPassword,
        user.email
    ]);
};

//tìm kiếm user bằng username
export const getUserByUsername = async (username) => {
    const [rows] = await pool.execute(
        "SELECT usrename, hashPassword FROM Users WHERE username = ?",
        [username]
    );
    return rows[0];
}

// đăng nhập
export const signIn = async (username) => {
    const [rows] = await pool.execute(
        "SELECT * FROM Users WHERE username = ?",
        [username]
    );
    return rows[0];
};

//cập nhật thông tin
export const updateUser = async (id, user) => {
    const query = `
        UPDATE Users
        SET username = ?, hashPassword = ?, email = ?, displayName = ?, phone = ?, bio = ?
        WHERE id = ?
    `;
    await pool.execute(query, [
        user.username,
        user.hashPassword,
        user.email,
        user.displayName,
        user.phone,
        user.bio,
        id
    ]);
};

//xóa user
export const deleteUser = async (id) => {
    const query = `
        DELETE FROM Users
        WHERE id = ?
    `;
    await pool.execute(query, [id]);
};


//chức năng quên mật khẩu, tìm kiếm bằng email
export const getUserByEmail = async (email) => {
    const [rows] = await pool.execute(
        "SELECT * FROM Users WHERE email = ?",
        [email]
    );
    return rows[0];
}

//chức năng quên mật khẩu tìm kiếm bằng số điện thoại
export const getUserByPhone = async (phone) => {
    const [rows] = await pool.execute(
        "SELECT * FROM Users WHERE phone = ?",
        [phone]
    );
    return rows[0];
}






