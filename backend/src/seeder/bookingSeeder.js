import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Table from '../models/Table.js';

const bookingSeeder = async () => {
    await Booking.destroy({ where: {} });

    const user = await User.findOne();
    const table = await Table.findOne();

    if (!user || !table) {
        console.log('Thiếu user hoặc table để seed booking');
        return;
    }

    await Booking.create({
        userId: user.id,
        tableId: table.id,
        time: new Date(),
        guestEmail: 'test@gmail.com',
        guestPhone: '0123456789',
        numberOfGuests: 4,
        specialRequests: 'Ngồi gần cửa sổ',
        status: 'đang chờ',
        totalPrice: 80000,
        PaymentMethod: 'tiền mặt',
        paymentStatus: 'chưa thanh toán'
    });

};

export default bookingSeeder;