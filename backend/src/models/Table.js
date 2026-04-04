import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const Table = sequelize.define('Table', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },

    tableNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },

    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 20
        }
    },

    type: {
        type: DataTypes.ENUM('standard', 'vip', 'bar', 'outdoor'),
        defaultValue: 'standard'
    },

    location: {
        type: DataTypes.ENUM('indoor', 'outdoor', 'terrace'),
        allowNull: false
    },

    description: {
        type: DataTypes.STRING(500),
        defaultValue: ""
    },

    status: {
        type: DataTypes.ENUM('available', 'occupied', 'reserved', 'maintenance'),
        defaultValue: 'available'
    },

    currentBookingId: {
        type: DataTypes.UUID,
        defaultValue: null
    },

    features: {
        type: DataTypes.JSON,
        defaultValue: {
            hasWindow: false,
            hasView: false,
            isHighChairs: false,
            wheelchair: false
        }
    },

    surchargePercentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 50
        }
    },

    lastCleaned: {
        type: DataTypes.DATE,
        defaultValue: null
    },

    maintenanceNotes: {
        type: DataTypes.STRING(500),
        defaultValue: ""
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
    tableName: 'Tables',
    timestamps: true,
    indexes: [
        {
            fields: ['status']
        },
        {
            fields: ['capacity']
        },
        {
            fields: ['type']
        },
        {
            fields: ['currentBookingId']
        }
    ]
});

export default Table;