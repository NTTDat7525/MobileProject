import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';
import User from './User.js';
import Booking from './Booking.js';
import Table from './Table.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },

    orderNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        sparse: true
    },

    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },

    bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Booking,
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

    items: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },

    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },

    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

    serviceCharge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

    discountReason: {
        type: DataTypes.STRING(500),
        defaultValue: ""
    },

    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },

    paymentMethod: {
        type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'mobile_wallet', 'bank_transfer'),
        allowNull: false
    },

    paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'paid', 'partial', 'refunded'),
        defaultValue: 'unpaid'
    },

    paidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

    paymentDate: {
        type: DataTypes.DATE,
        defaultValue: null
    },

    transactionId: {
        type: DataTypes.STRING(100),
        defaultValue: null
    },

    status: {
        type: DataTypes.ENUM('pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },

    orderedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    startedAt: {
        type: DataTypes.DATE,
        defaultValue: null
    },

    completedAt: {
        type: DataTypes.DATE,
        defaultValue: null
    },

    notes: {
        type: DataTypes.STRING(500),
        defaultValue: ""
    },

    internalNotes: {
        type: DataTypes.STRING(500),
        defaultValue: ""
    },

    invoiceNumber: {
        type: DataTypes.STRING(50),
        defaultValue: null
    },

    cancellationReason: {
        type: DataTypes.STRING(500),
        defaultValue: null
    },

    loyaltyPointsUsed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    loyaltyPointsEarned: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    tableName: 'Orders',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['bookingId']
        },
        {
            fields: ['tableId']
        },
        {
            fields: ['paymentStatus']
        },
        {
            fields: ['status']
        },
        {
            fields: ['paymentMethod']
        }
    ]
});

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
Order.belongsTo(Table, { foreignKey: 'tableId', as: 'table' });

export default Order;