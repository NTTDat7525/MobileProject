import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME || 'mobile',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        dialectOptions: {
            connectTimeout: 60000,
            supportBigNumbers: true,
            bigNumberStrings: true
        },
        logging: process.env.DB_LOG === 'true' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: false
        }
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL successfully!');
        
        // Đồng bộ hóa tất cả models
        await sequelize.sync();
        console.log('Database synchronized!');
        
        return sequelize;
    } catch (error) {
        console.log('Error connecting to MySQL:', error);
        process.exit(1);
    }
};

export default sequelize;