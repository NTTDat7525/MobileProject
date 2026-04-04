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

    guestName: {
        type: DataTypes.STRING(150),
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

    tableId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Table,
            key: 'id'
        }
    },

    bookingDate: {
        type: DataTypes.DATE,
        allowNull: false
    },

    checkInTime: {
        type: DataTypes.DATE,
        defaultValue: null
    },

    checkOutTime: {
        type: DataTypes.DATE,
        defaultValue: null
    },

    estimatedDuration: {
        type: DataTypes.INTEGER,
        defaultValue: 120,
        validate: {
            min: 30,
            max: 480
        }
    },

    specialRequests: {
        type: DataTypes.STRING(500),
        defaultValue: ""
    },

    dietaryRestrictions: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    occasion: {
        type: DataTypes.ENUM('regular', 'birthday', 'anniversary', 'business', 'other'),
        defaultValue: 'regular'
    },

    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'checked-in', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },

    cancellationReason: {
        type: DataTypes.STRING(500),
        defaultValue: null
    },

    cancellationDate: {
        type: DataTypes.DATE,
        defaultValue: null
    },

    orderId: {
        type: DataTypes.UUID,
        defaultValue: null
    },

    internalNotes: {
        type: DataTypes.STRING(500),
        defaultValue: ""
    },

    reminderSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['tableId']
        },
        {
            fields: ['status']
        },
        {
            fields: ['bookingDate']
        }
    ]
});

Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Table, { foreignKey: 'tableId', as: 'table' });

export default Booking;