import pool from '../connection.js';

//lấy tất cả bàn
export const getAllTables = async () => {
    const [rows] = await pool.execute(
        "SELECT * FROM Tables"
    );
    return rows;
}

//lấy bàn còn trống
export const getAvailableTables = async () => {
    const [rows] = await pool.execute(
        "SELECT * FROM Tables WHERE status = 'Còn trống'"
    );
    return rows;
}


export const createTable = async (id) => {
    const [rows] = await pool.execute(
        "INSERT INTO Tables (name, capacity, location) VALUES (?, ?, ?)",
        [id]
    );
    return rows[0]
}



export const updateTable = async (id, table) => {
    const query = `
        UPDATE Tables
        SET name = ?, capacity = ?, location = ?, status = ?
        WHERE id = ?
    `;
    await pool.execute(query, [
        table.name,
        table.capacity,
        table.location,
        table.status,
        id
    ]);
}

export const deleteTable = async (id) => {
    await pool.execute(
        "DELETE FROM Tables WHERE id = ?",
        [id]
    );
}

export const updateStausTable = async (id, status) => {
    const query = `
        UPDATE Tables
        SET status = ?
        WHERE id = ?
    `;
    await pool.execute(query, [
        status,
        id
    ]);
}