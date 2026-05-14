import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';
import User from './User.js';
import Table from './Table.js';

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },

    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },

    tableId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Table,
            key: 'id'
        }
    },

    time: {
        type: DataTypes.DATE,
        allowNull: false
    },

    guestEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },

    guestPhone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },

    numberOfGuests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 30
        }
    },

    specialRequests: {
        type: DataTypes.STRING(500),
        defaultValue: ''
    },

    status: {
        type: DataTypes.ENUM('đang chờ', 'đã xác nhận', 'đã check-in', 'hoàn thành', 'đã hủy'),
        defaultValue: 'đang chờ'
    },

    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

    PaymentMethod: {
        type: DataTypes.ENUM('tiền mặt', 'chuyển khoản ngân hàng'),
        defaultValue: 'tiền mặt'
    },

    paymentStatus: {
        type: DataTypes.ENUM('chưa thanh toán', 'đã thanh toán'),
        defaultValue: 'chưa thanh toán'
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Bookings',
    timestamps: true,
});

Booking.belongsTo(User, { foreignKey: 'userId', as: 'User' });
Booking.belongsTo(Table, {
    foreignKey: 'tableId',
    as: 'Table',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

export default Booking;
