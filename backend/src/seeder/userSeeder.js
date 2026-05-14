import bcrypt from 'bcrypt';
import User from '../models/User.js';

const userSeeder = async () => {
  const users = [
    {
      username: 'user01',
      email: 'user01@gmail.com',
      role: 'user'
    },
    {
      username: 'admin01',
      email: 'admin01@gmail.com',
      role: 'admin'
    }
  ];

  const hashedPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD || '123456', 10);

  for (const user of users) {
    await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        ...user,
        hashPassword: hashedPassword,
      }
    });
  }

  console.log('Seed người dùng thành công');
};

export default userSeeder;
