import Table from '../models/Table.js';

const tableSeeder = async () => {
    await Table.destroy({ where: {} });

    await Table.bulkCreate([
    {
        tableName: 'T01',
        capacity: 2,
        location: 'Trong nhà',
        image: null,
        status: 'Có sẵn',
        price: 50000
    },

    {
        tableName: 'T02',
        capacity: 4,
        location: 'Ngoài trời',
        image: null,
        status: 'Có sẵn',
        price: 80000
    },

    {
        tableName: 'T03',
        capacity: 6,
        location: 'Sân thượng',
        image: null,
        status: 'Có sẵn',
        price: 120000
    }
    ]);

};

export default tableSeeder;