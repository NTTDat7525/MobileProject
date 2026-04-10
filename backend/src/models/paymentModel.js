import pool from '../db/connection.js';

export const createPaymentModel = async () => {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS Payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            bookingId INT,
            amount DECIMAL(10, 2),
            paymentMethod ENUM('Tiền mặt', 'Chuyển khoản'),
            status ENUM('Đang xử lý', 'Hoàn thành', 'Hủy') DEFAULT 'Đang xử lý',
            transactionId VARCHAR(255),
            FOREIGN KEY (bookingId) REFERENCES Bookings(id) ON DELETE CASCADE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};