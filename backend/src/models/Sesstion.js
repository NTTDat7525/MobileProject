import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';
import User from './User.js';

const Session = sequelize.define('Session', {
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

    refreshToken: {
        type: DataTypes.STRING(512),
        allowNull: false,
        unique: true
    },

    accessToken: {
        type: DataTypes.STRING(512),
        defaultValue: null
    },

    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },

    deviceInfo: {
        type: DataTypes.JSON,
        defaultValue: {
            userAgent: "",
            deviceType: "mobile",
            deviceName: "",
            osType: "Other",
            osVersion: "",
            browser: ""
        }
    },

    ipAddress: {
        type: DataTypes.STRING(50),
        defaultValue: null
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    location: {
        type: DataTypes.JSON,
        defaultValue: {
            country: null,
            city: null,
            latitude: null,
            longitude: null
        }
    },

    lastActivityAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    loginAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    logoutAt: {
        type: DataTypes.DATE,
        defaultValue: null
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
    tableName: 'Sessions',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['expiresAt']
        },
        {
            fields: ['isActive']
        },
        {
            fields: ['ipAddress']
        }
    ]
});

Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Session;