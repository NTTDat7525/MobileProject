import pool from '../db/connection.js';

export const createTableModel = async () => {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS Tables (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) UNIQUE,
            capacity INT,
            location VARCHAR(255),
            status ENUM('Còn trống', 'Đang sử dụng', 'Đã đặt') DEFAULT 'Còn trống',
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
};