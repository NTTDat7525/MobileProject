import pool from '../db/connection.js';

export const createUserModel = async () => {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE,
            hashPassword VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            displayName VARCHAR(255),
            phone VARCHAR(20),
            bio VARCHAR(500),
            role ENUM('user','admin') DEFAULT 'user',
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
};