import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const Table = sequelize.define('Table', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    
    tableName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
//số lượng khách tối đa
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 20
        }
    },

    location: {
        type: DataTypes.ENUM('Ngoài trời', 'Trong nhà', 'Sân thượng'),
        allowNull: false
    },

    image :{
        type: DataTypes.STRING(255),
        defaultValue: null
    },

    status: {
        type: DataTypes.ENUM('Có sẵn', 'Đang sử dụng', 'Đã đặt', 'Bảo trì'),
        defaultValue: 'Có sẵn'
    },

    price :{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
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
});

export default Table;