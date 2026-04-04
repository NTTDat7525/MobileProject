import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';
import { authorizeRoles } from './middlewares/roleMiddleware.js';
import paymentRoute from "./routes/paymentRoute.js"
import cors from "cors";

// Import all models to ensure they're registered with Sequelize
import User from './models/User.js';
import Session from './models/Sesstion.js';
import Table from './models/Table.js';
import Food from './models/Food.js';
import Order from './models/Order.js';
import Booking from './models/Booking.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Cấu hình CORS
app.use(cors({
  origin: true, // cho phép tất cả origin trong development
  credentials: true, // cho phép gửi cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//middleware
app.use(express.json());//đọc json từ request body
app.use(cookieParser());

//public routes
app.use('/api/auth', authRoute);

//private routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/admin', authorizeRoles("admin"), adminRoute);
app.use('/api/', paymentRoute)
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    });
}).catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});
