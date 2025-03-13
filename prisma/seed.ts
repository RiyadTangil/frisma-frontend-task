import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create Masjids
  const masjid1 = await prisma.masjid.upsert({
    where: { id: 'clm1' },
    update: {},
    create: {
      id: 'clm1',
      name: 'Masjid Al-Noor',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '212-555-1234',
      email: 'info@masjidalnoor.org',
      website: 'https://masjidalnoor.org',
    },
  });

  const masjid2 = await prisma.masjid.upsert({
    where: { id: 'clm2' },
    update: {},
    create: {
      id: 'clm2',
      name: 'Masjid Al-Iman',
      address: '456 Oak Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      phone: '312-555-6789',
      email: 'contact@masjid-aliman.org',
      website: 'https://masjid-aliman.org',
    },
  });

  const masjid3 = await prisma.masjid.upsert({
    where: { id: 'clm3' },
    update: {},
    create: {
      id: 'clm3',
      name: 'Masjid Al-Taqwa',
      address: '789 Pine Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      phone: '213-555-9876',
      email: 'info@masjidaltaqwa.org',
      website: 'https://masjidaltaqwa.org',
    },
  });

  // Adding more masjids
  const masjid4 = await prisma.masjid.upsert({
    where: { id: 'clm4' },
    update: {},
    create: {
      id: 'clm4',
      name: 'Masjid Al-Rahman',
      address: '321 Islamic Center Way',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
      phone: '713-555-4321',
      email: 'info@masjidalrahman.org',
      website: 'https://masjidalrahman.org',
    },
  });

  const masjid5 = await prisma.masjid.upsert({
    where: { id: 'clm5' },
    update: {},
    create: {
      id: 'clm5',
      name: 'Masjid Al-Huda',
      address: '567 Faith Street',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
      phone: '305-555-8765',
      email: 'contact@masjidalhuda.org',
      website: 'https://masjidalhuda.org',
    },
  });

  const masjid6 = await prisma.masjid.upsert({
    where: { id: 'clm6' },
    update: {},
    create: {
      id: 'clm6',
      name: 'Masjid Al-Salam',
      address: '890 Peace Avenue',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      phone: '206-555-2468',
      email: 'info@masjidalsalam.org',
      website: 'https://masjidalsalam.org',
    },
  });

  // Create Banks for new Masjids
  const bank5 = await prisma.bank.upsert({
    where: { id: 'clb5' },
    update: {},
    create: {
      id: 'clb5',
      name: 'US Bank',
      accountNumber: '9876543210',
      routingNumber: '123456789',
      address: '500 Banking Street',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
      masjidId: masjid4.id,
    },
  });

  const bank6 = await prisma.bank.upsert({
    where: { id: 'clb6' },
    update: {},
    create: {
      id: 'clb6',
      name: 'TD Bank',
      accountNumber: '5432109876',
      routingNumber: '987654321',
      address: '600 Finance Road',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
      masjidId: masjid5.id,
    },
  });

  const bank7 = await prisma.bank.upsert({
    where: { id: 'clb7' },
    update: {},
    create: {
      id: 'clb7',
      name: 'KeyBank',
      accountNumber: '1357924680',
      routingNumber: '246813579',
      address: '700 Money Lane',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      masjidId: masjid6.id,
    },
  });

  // Create Deposits for new Banks
  await prisma.deposit.upsert({
    where: { id: 'cld6' },
    update: {},
    create: {
      id: 'cld6',
      amount: 12000.00,
      description: 'Annual donation',
      depositDate: new Date('2024-01-15'),
      bankId: bank5.id,
    },
  });

  await prisma.deposit.upsert({
    where: { id: 'cld7' },
    update: {},
    create: {
      id: 'cld7',
      amount: 8500.00,
      description: 'Community fundraiser',
      depositDate: new Date('2024-02-20'),
      bankId: bank6.id,
    },
  });

  await prisma.deposit.upsert({
    where: { id: 'cld8' },
    update: {},
    create: {
      id: 'cld8',
      amount: 20000.00,
      description: 'Expansion project',
      depositDate: new Date('2024-03-01'),
      bankId: bank7.id,
    },
  });

  // Keep existing banks and deposits...
  const bank1 = await prisma.bank.upsert({
    where: { id: 'clb1' },
    update: {},
    create: {
      id: 'clb1',
      name: 'Chase Bank',
      accountNumber: '1234567890',
      routingNumber: '021000021',
      address: '100 Park Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      masjidId: masjid1.id,
    },
  });

  const bank2 = await prisma.bank.upsert({
    where: { id: 'clb2' },
    update: {},
    create: {
      id: 'clb2',
      name: 'Bank of America',
      accountNumber: '0987654321',
      routingNumber: '026009593',
      address: '200 Broadway',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      masjidId: masjid1.id,
    },
  });

  const bank3 = await prisma.bank.upsert({
    where: { id: 'clb3' },
    update: {},
    create: {
      id: 'clb3',
      name: 'Wells Fargo',
      accountNumber: '1122334455',
      routingNumber: '121000248',
      address: '300 Michigan Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      masjidId: masjid2.id,
    },
  });

  const bank4 = await prisma.bank.upsert({
    where: { id: 'clb4' },
    update: {},
    create: {
      id: 'clb4',
      name: 'Citibank',
      accountNumber: '5566778899',
      routingNumber: '021000089',
      address: '400 Wilshire Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      masjidId: masjid3.id,
    },
  });

  await prisma.deposit.upsert({
    where: { id: 'cld1' },
    update: {},
    create: {
      id: 'cld1',
      amount: 5000.00,
      description: 'Monthly donation',
      depositDate: new Date('2023-01-15'),
      bankId: bank1.id,
    },
  });

  await prisma.deposit.upsert({
    where: { id: 'cld2' },
    update: {},
    create: {
      id: 'cld2',
      amount: 7500.00,
      description: 'Ramadan donation',
      depositDate: new Date('2023-04-10'),
      bankId: bank1.id,
    },
  });

  await prisma.deposit.upsert({
    where: { id: 'cld3' },
    update: {},
    create: {
      id: 'cld3',
      amount: 3000.00,
      description: 'Weekly collection',
      depositDate: new Date('2023-02-05'),
      bankId: bank2.id,
    },
  });

  await prisma.deposit.upsert({
    where: { id: 'cld4' },
    update: {},
    create: {
      id: 'cld4',
      amount: 10000.00,
      description: 'Eid donation',
      depositDate: new Date('2023-06-20'),
      bankId: bank3.id,
    },
  });

  await prisma.deposit.upsert({
    where: { id: 'cld5' },
    update: {},
    create: {
      id: 'cld5',
      amount: 15000.00,
      description: 'Construction fund',
      depositDate: new Date('2023-03-25'),
      bankId: bank4.id,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 