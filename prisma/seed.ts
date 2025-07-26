// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('password123', 12); // Password yang sama untuk semua user testing

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pln.co.id' },
    update: {},
    create: {
      email: 'admin@pln.co.id',
      name: 'Admin TJSL',
      password,
      role: 'ADMIN',
    },
  });
  console.log('Created Admin:', { id: admin.id, email: admin.email, name: admin.name, role: admin.role });

  // Create User 1 - Pelaksana Program
  const user1 = await prisma.user.upsert({
    where: { email: 'budi.santoso@pln.co.id' },
    update: {},
    create: {
      email: 'budi.santoso@pln.co.id',
      name: 'Budi Santoso',
      password,
      role: 'USER',
    },
  });
  console.log('Created User 1:', { id: user1.id, email: user1.email, name: user1.name, role: user1.role });

  // Create User 2 - Pelaksana Program
  const user2 = await prisma.user.upsert({
    where: { email: 'siti.rahayu@pln.co.id' },
    update: {},
    create: {
      email: 'siti.rahayu@pln.co.id',
      name: 'Siti Rahayu',
      password,
      role: 'USER',
    },
  });
  console.log('Created User 2:', { id: user2.id, email: user2.email, name: user2.name, role: user2.role });

  // Create User 3 - Pelaksana Program
  const user3 = await prisma.user.upsert({
    where: { email: 'ahmad.wijaya@pln.co.id' },
    update: {},
    create: {
      email: 'ahmad.wijaya@pln.co.id',
      name: 'Ahmad Wijaya',
      password,
      role: 'USER',
    },
  });
  console.log('Created User 3:', { id: user3.id, email: user3.email, name: user3.name, role: user3.role });

  // Create User 4 - Pelaksana Program
  const user4 = await prisma.user.upsert({
    where: { email: 'dewi.kartika@pln.co.id' },
    update: {},
    create: {
      email: 'dewi.kartika@pln.co.id',
      name: 'Dewi Kartika',
      password,
      role: 'USER',
    },
  });
  console.log('Created User 4:', { id: user4.id, email: user4.email, name: user4.name, role: user4.role });

  console.log('\n=== SEED COMPLETED ===');
  console.log('Login credentials for testing:');
  console.log('1. Admin: admin@pln.co.id / password123');
  console.log('2. User 1: budi.santoso@pln.co.id / password123');
  console.log('3. User 2: siti.rahayu@pln.co.id / password123');
  console.log('4. User 3: ahmad.wijaya@pln.co.id / password123');
  console.log('5. User 4: dewi.kartika@pln.co.id / password123');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });