import pool from '../db/connection.js';

export const createBookingModel = async () => {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS Bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT,
            tableId INT,

            time DATETIME,
            guestCount INT,
            status ENUM('Đang xử lý', 'Hoàn thành', 'Đã hủy') DEFAULT 'Đang xử lý',
            note VARCHAR(500),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (tableId) REFERENCES Tables(id) ON DELETE CASCADE
        )
    `);
};