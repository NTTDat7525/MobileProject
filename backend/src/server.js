import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import verificationRoute from './routes/verificationRoute.js';
import { handleSepayWebhook } from './controllers/paymentController.js';
import { protectedRoute } from './middlewares/authMiddleware.js';
import { authorizeRoles } from './middlewares/roleMiddleware.js';

import User from './models/User.js';
import Session from './models/Sesstion.js';
import Table from './models/Table.js';
import Booking from './models/Booking.js';
import EmailVerification from './models/EmailVerification.js';
import tableSeeder from './seeder/tableSeeder.js';
import userSeeder from './seeder/userSeeder.js';
import bookingSeeder from './seeder/bookingSeeder.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Giữ import model để Sequelize đăng ký association trước khi sync.
void User;
void Session;
void Table;
void Booking;
void EmailVerification;

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.post('/api/payments/sepay/webhook', express.raw({ type: 'application/json' }), handleSepayWebhook);

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend Golden Spoons đang hoạt động' });
});

app.use('/api/auth', authRoute);
app.use('/api/verification', verificationRoute);

app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/admin', authorizeRoles('admin'), adminRoute);

connectDB()
  .then(async () => {
    if (process.env.RUN_SEEDERS === 'true') {
      await userSeeder();
      await tableSeeder();
      await bookingSeeder();
    }

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại cổng ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Không thể kết nối cơ sở dữ liệu:', err);
    process.exit(1);
  });
