import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const EmailVerification = sequelize.define('EmailVerification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },

    otp: {
        type: DataTypes.STRING(6),
        allowNull: false
    },

    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false, // Không sử dụng timestamps tự động
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

export default EmailVerification;