import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};