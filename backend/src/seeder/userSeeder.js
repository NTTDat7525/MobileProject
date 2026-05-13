import bcrypt from 'bcrypt';
import User from '../models/User.js';

const userSeeder = async () => {
  const existing = await User.findOne({
    where: { email: 'admin01@gmail.com' }
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('123456', 10);

    await User.bulkCreate([
      {
        username: 'user01',
        email: 'user01@gmail.com',
        hashPassword: hashedPassword,
        role: 'user'
      },
      {
        username: 'admin01',
        email: 'admin01@gmail.com',
        hashPassword: hashedPassword,
        role: 'admin'
      }
    ]);

    console.log('Seed user thành công');
  }
};

export default userSeeder;