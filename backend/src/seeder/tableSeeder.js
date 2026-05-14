import Table from '../models/Table.js';

const tableSeeder = async () => {
    const tables = [
        {
            tableName: 'T01',
            capacity: 2,
            location: 'Trong nhà',
            image: null,
            status: 'Có sẵn',
            price: 2000
        },
        {
            tableName: 'T02',
            capacity: 4,
            location: 'Ngoài trời',
            image: null,
            status: 'Có sẵn',
            price: 4000
        },
        {
            tableName: 'T03',
            capacity: 6,
            location: 'Sân thượng',
            image: null,
            status: 'Có sẵn',
            price: 30000
        }
    ];

    for (const table of tables) {
        await Table.findOrCreate({
            where: { tableName: table.tableName },
            defaults: table
        });
    }

    console.log('Seed bàn thành công');
};

export default tableSeeder;
