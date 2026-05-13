import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 100]
        }
    },

    hashPassword: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    bio: {
        type: DataTypes.STRING(500),
        defaultValue: ""
    },

    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },

    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
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
    tableName: 'Users',
    timestamps: true,
});

export default User;