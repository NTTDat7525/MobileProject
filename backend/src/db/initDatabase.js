import { createBookingModel } from '../models/bookingModel.js';
import { createUserModel } from '../models/userModel.js';
import { createTableModel } from '../models/tableModel.js';
import { createPaymentModel } from '../models/paymentModel.js';

export const initDatabase = async () => {
    await createUserModel();
    await createTableModel();
    await createBookingModel();
    await createPaymentModel();
};