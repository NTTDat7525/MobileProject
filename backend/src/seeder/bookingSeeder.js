import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Table from '../models/Table.js';

const bookingSeeder = async () => {
    const existing = await Booking.findOne();
    if (existing) return;

    const user = await User.findOne({ where: { role: 'user' } });
    const table = await Table.findOne();

    if (!user || !table) {
        console.log('Thiếu user hoặc bàn để seed đặt bàn');
        return;
    }

    await Booking.create({
        userId: user.id,
        tableId: table.id,
        time: new Date(Date.now() + 24 * 60 * 60 * 1000),
        guestEmail: 'test@gmail.com',
        guestPhone: '0123456789',
        numberOfGuests: Math.min(4, table.capacity),
        specialRequests: 'Ngồi gần cửa sổ',
        status: 'đang chờ',
        totalPrice: table.price,
        PaymentMethod: 'tiền mặt',
        paymentStatus: 'chưa thanh toán'
    });

    await table.update({ status: 'Đã đặt' });
    console.log('Seed đặt bàn thành công');
};

export default bookingSeeder;
