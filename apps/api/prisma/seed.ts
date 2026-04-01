import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create some sample vehicles
  await prisma.vehicle.createMany({
    data: [
      {
        make: 'Toyota',
        model: 'Corolla',
        year: 2022,
        plateNumber: 'AA-2-B12345',
        dailyRate: 2500,
      },
      {
        make: 'Suzuki',
        model: 'Swift',
        year: 2023,
        plateNumber: 'AA-2-A98765',
        dailyRate: 1800,
      },
      {
        make: 'Hyundai',
        model: 'Tucson',
        year: 2021,
        plateNumber: 'AA-2-C55443',
        dailyRate: 4500,
      },
    ],
  });

  console.log('✅ Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
