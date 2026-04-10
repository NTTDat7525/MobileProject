import pool from '../connection.js';

export const getAllBookings = async () => {
    const [rows] = await pool.execute(
        "SELECT * FROM Bookings"
    );
    return rows;
}

export const createBooking = async (booking) => {
    const [rows] = await pool.execute(
        "INSERT INTO Bookings (userId, tableId, time, status) VALUES (?, ?, ?, ?)",
        [booking.userId, booking.tableId, booking.time, booking.status]
    );
    return rows[0]
}

export const updateBooking = async (id, booking) => {
    const query = `
        UPDATE Bookings
        SET userId = ?, tableId = ?, time = ?, status = ?
        WHERE id = ?
    `;
    await pool.execute(query, [
        booking.userId,
        booking.tableId,
        booking.time,
        booking.status,
        id
    ]);
}

export const getBookingById = async (id) => {
    const [rows] = await pool.execute(
        "SELECT * FROM Bookings WHERE id = ?",
        [id]
    );
    return rows[0];
}

export const getBookingsByUserId = async (userId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM Bookings WHERE userId = ?",
        [userId]
    );
    return rows;
}

export const historyBooking = async (userId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM Bookings WHERE userId = ? AND time < NOW()",
        [userId]
    );
    return rows;
}

export const upcomingBooking = async (userId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM Bookings WHERE userId = ? AND time >= NOW()",
        [userId]
    );
    return rows;
}

export const cancelBooking = async (id) => {
    const query = `
        UPDATE Bookings
        SET status = 'Đã hủy'
        WHERE id = ?
    `;
    await pool.execute(query, [id]);
}
