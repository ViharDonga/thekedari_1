import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear tables
  await prisma.labourBooking.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.rentalMaterial.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.materialDelivery.deleteMany();
  await prisma.materialInventory.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.constructionSite.deleteMany();

  // Create Sites
  const site1 = await prisma.constructionSite.create({
    data: {
      id: 'site-1',
      name: 'Skyline Heights, Tower A',
      location: 'Sector 62, Noida',
      budget: 4500000,
      spentWages: 320000,
      spentMaterials: 890000,
      spentRentals: 2000,
      otherExpenses: 45000,
      totalExpenses: 1257000,
      supervisorName: 'Rajesh Kumar',
    },
  });

  const site2 = await prisma.constructionSite.create({
    data: {
      id: 'site-2',
      name: 'Riverview Luxury Villa',
      location: 'Jubilee Hills, Hyderabad',
      budget: 2500000,
      spentWages: 180000,
      spentMaterials: 420000,
      spentRentals: 1250,
      otherExpenses: 25000,
      totalExpenses: 626250,
      supervisorName: 'S. Srinivasan',
    },
  });

  const site3 = await prisma.constructionSite.create({
    data: {
      id: 'site-3',
      name: 'Greenwood Row Houses',
      location: 'Whitefield, Bangalore',
      budget: 8000000,
      spentWages: 450000,
      spentMaterials: 1200000,
      spentRentals: 0,
      otherExpenses: 80000,
      totalExpenses: 1730000,
      supervisorName: 'Amit Patel',
    },
  });

  // Create Workers
  // Site 1 workers
  await prisma.worker.createMany({
    data: [
      { id: 'w-1', name: 'Vikram Singh', role: 'Mason', dailyRate: 850, siteId: 'site-1', advancePaid: 2000, balanceDue: 4500, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43210', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', employmentType: 'Permanent' },
      { id: 'w-2', name: 'Amit Yadav', role: 'Labour', dailyRate: 550, siteId: 'site-1', advancePaid: 1000, balanceDue: 2200, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43211', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', employmentType: 'Permanent' },
      { id: 'w-3', name: 'Sanjay Paswan', role: 'Labour', dailyRate: 550, siteId: 'site-1', advancePaid: 500, balanceDue: 2750, statusToday: 'Not Called', overtimeHours: 0, phone: '+91 98765 43212', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', employmentType: 'Casual' },
      { id: 'w-4', name: 'Ramesh Lal', role: 'Mason', dailyRate: 850, siteId: 'site-1', advancePaid: 1500, balanceDue: 3400, statusToday: 'Overtime', overtimeHours: 2, phone: '+91 98765 43213', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', employmentType: 'Permanent' },
      { id: 'w-5', name: 'Vinod Sharma', role: 'Plumber', dailyRate: 750, siteId: 'site-1', advancePaid: 0, balanceDue: 5250, statusToday: 'Not Called', overtimeHours: 0, phone: '+91 98765 43214', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', employmentType: 'Casual' },
      // Site 2 workers
      { id: 'w-6', name: 'Karan Johar', role: 'Supervisor', dailyRate: 1200, siteId: 'site-2', advancePaid: 5000, balanceDue: 8400, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43215', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', employmentType: 'Permanent' },
      { id: 'w-7', name: 'Mukesh Ram', role: 'Labour', dailyRate: 500, siteId: 'site-2', advancePaid: 800, balanceDue: 1500, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43216', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', employmentType: 'Permanent' },
      { id: 'w-8', name: 'Harish Rawat', role: 'Mason', dailyRate: 800, siteId: 'site-2', advancePaid: 2000, balanceDue: 3200, statusToday: 'Half Day', overtimeHours: 0, phone: '+91 98765 43217', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', employmentType: 'Casual' },
      // Site 3 workers
      { id: 'w-9', name: 'Sunil Dutt', role: 'Supervisor', dailyRate: 1300, siteId: 'site-3', advancePaid: 4000, balanceDue: 12000, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43218', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', employmentType: 'Permanent' },
      { id: 'w-10', name: 'Suresh Kumar', role: 'Electrician', dailyRate: 800, siteId: 'site-3', advancePaid: 1500, balanceDue: 4800, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43219', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', employmentType: 'Permanent' },
      { id: 'w-11', name: 'Madan Mohan', role: 'Labour', dailyRate: 550, siteId: 'site-3', advancePaid: 500, balanceDue: 2200, statusToday: 'Absent', overtimeHours: 0, phone: '+91 98765 43220', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', employmentType: 'Casual' }
    ]
  });

  // Create MaterialInventory
  await prisma.materialInventory.createMany({
    data: [
      { id: 'm-1', siteId: 'site-1', name: 'Cement (UltraTech)', unit: 'Bags', stock: 450, lowStockThreshold: 100, lastUpdated: '2026-06-02' },
      { id: 'm-2', siteId: 'site-1', name: 'Steel (Jindal Panther)', unit: 'Tons', stock: 12.5, lowStockThreshold: 3.0, lastUpdated: '2026-06-02' },
      { id: 'm-3', siteId: 'site-1', name: 'Sand (River Sand)', unit: 'Brass', stock: 8, lowStockThreshold: 10, lastUpdated: '2026-06-01' },
      { id: 'm-4', siteId: 'site-1', name: 'Bricks (Red Clay)', unit: 'Pcs', stock: 18000, lowStockThreshold: 5000, lastUpdated: '2026-06-02' },
      { id: 'm-5', siteId: 'site-2', name: 'Cement (Ambuja)', unit: 'Bags', stock: 80, lowStockThreshold: 50, lastUpdated: '2026-06-02' },
      { id: 'm-6', siteId: 'site-2', name: 'Steel (Tata Tiscon)', unit: 'Tons', stock: 4.8, lowStockThreshold: 2.0, lastUpdated: '2026-06-01' },
      { id: 'm-7', siteId: 'site-2', name: 'Bricks (Red Clay)', unit: 'Pcs', stock: 4000, lowStockThreshold: 3000, lastUpdated: '2026-06-02' },
      { id: 'm-8', siteId: 'site-3', name: 'Cement (UltraTech)', unit: 'Bags', stock: 680, lowStockThreshold: 150, lastUpdated: '2026-06-02' },
      { id: 'm-9', siteId: 'site-3', name: 'Steel (Jindal Panther)', unit: 'Tons', stock: 22.0, lowStockThreshold: 5.0, lastUpdated: '2026-06-02' },
      { id: 'm-10', siteId: 'site-3', name: 'Sand (M-Sand)', unit: 'Brass', stock: 24, lowStockThreshold: 15, lastUpdated: '2026-06-02' }
    ]
  });

  // Create MaterialDelivery
  await prisma.materialDelivery.createMany({
    data: [
      { id: 'del-1', siteId: 'site-1', materialName: 'Cement (UltraTech)', supplierName: 'Balaji Building Materials', quantity: 200, unit: 'Bags', ratePerUnit: 420, totalAmount: 84000, status: 'Delivered', date: '2026-06-02' },
      { id: 'del-2', siteId: 'site-1', materialName: 'Steel (Jindal Panther)', supplierName: 'Aggarwal Steels', quantity: 5.5, unit: 'Tons', ratePerUnit: 62000, totalAmount: 341000, status: 'Delivered', date: '2026-06-01' },
      { id: 'del-3', siteId: 'site-1', materialName: 'Sand (River Sand)', supplierName: 'Choudhary Suppliers', quantity: 10, unit: 'Brass', ratePerUnit: 6500, totalAmount: 65000, status: 'Delivered', date: '2026-05-28' },
      { id: 'del-4', siteId: 'site-1', materialName: 'Bricks (Red Clay)', supplierName: 'Sagar Brick Kiln', quantity: 10000, unit: 'Pcs', ratePerUnit: 7, totalAmount: 70000, status: 'Pending', date: '2026-06-03' },
      { id: 'del-5', siteId: 'site-2', materialName: 'Cement (Ambuja)', supplierName: 'Deccan Cements Ltd', quantity: 100, unit: 'Bags', ratePerUnit: 400, totalAmount: 40000, status: 'Delivered', date: '2026-06-02' },
      { id: 'del-6', siteId: 'site-3', materialName: 'Steel (Jindal Panther)', supplierName: 'Karnataka Steel House', quantity: 10, unit: 'Tons', ratePerUnit: 60500, totalAmount: 605000, status: 'Delivered', date: '2026-06-02' }
    ]
  });

  // Create Transactions
  await prisma.transaction.createMany({
    data: [
      { id: 'tx-1', workerId: 'w-1', workerName: 'Vikram Singh', siteId: 'site-1', amount: 5000, type: 'Wage Payment', date: '2026-05-30', paymentMode: 'UPI' },
      { id: 'tx-2', workerId: 'w-1', workerName: 'Vikram Singh', siteId: 'site-1', amount: 1000, type: 'Advance Payment', date: '2026-06-01', paymentMode: 'Cash' },
      { id: 'tx-3', workerId: 'w-2', workerName: 'Amit Yadav', siteId: 'site-1', amount: 3000, type: 'Wage Payment', date: '2026-05-30', paymentMode: 'Bank Transfer' },
      { id: 'tx-4', workerId: 'w-6', workerName: 'Karan Johar', siteId: 'site-2', amount: 8000, type: 'Wage Payment', date: '2026-05-31', paymentMode: 'UPI' },
      { id: 'tx-5', workerId: 'w-9', workerName: 'Sunil Dutt', siteId: 'site-3', amount: 12000, type: 'Wage Payment', date: '2026-05-31', paymentMode: 'Bank Transfer' }
    ]
  });

  // Create AttendanceRecord
  await prisma.attendanceRecord.createMany({
    data: [
      { id: 'att-1', date: '2026-06-02', workerId: 'w-1', siteId: 'site-1', status: 'Present', overtimeHours: 0, wageEarned: 850 },
      { id: 'att-2', date: '2026-06-02', workerId: 'w-2', siteId: 'site-1', status: 'Present', overtimeHours: 0, wageEarned: 550 },
      { id: 'att-4', date: '2026-06-02', workerId: 'w-4', siteId: 'site-1', status: 'Overtime', overtimeHours: 2, wageEarned: 1062.5 },
      { id: 'att-6', date: '2026-06-02', workerId: 'w-6', siteId: 'site-2', status: 'Present', overtimeHours: 0, wageEarned: 1200 },
      { id: 'att-7', date: '2026-06-02', workerId: 'w-7', siteId: 'site-2', status: 'Present', overtimeHours: 0, wageEarned: 500 },
      { id: 'att-8', date: '2026-06-02', workerId: 'w-8', siteId: 'site-2', status: 'Half Day', overtimeHours: 0, wageEarned: 400 },
      { id: 'att-9', date: '2026-06-02', workerId: 'w-9', siteId: 'site-3', status: 'Present', overtimeHours: 0, wageEarned: 1300 },
      { id: 'att-10', date: '2026-06-02', workerId: 'w-10', siteId: 'site-3', status: 'Present', overtimeHours: 0, wageEarned: 800 },
      { id: 'att-11', date: '2026-06-02', workerId: 'w-11', siteId: 'site-3', status: 'Absent', overtimeHours: 0, wageEarned: 0 }
    ]
  });

  // Create RentalMaterial
  await prisma.rentalMaterial.createMany({
    data: [
      { id: 'r-1', siteId: 'site-1', name: 'Steel Plate', size: '3*3', quantity: 200, ratePerDay: 10, supplierName: 'Balaji Rentals', startDate: '2026-06-01' },
      { id: 'r-2', siteId: 'site-2', name: 'Scaffolding Pipes', size: '20ft', quantity: 50, ratePerDay: 5, supplierName: 'Metro Scaffolding', startDate: '2026-05-28', endDate: '2026-06-02' }
    ]
  });

  // Create LabourBooking
  await prisma.labourBooking.createMany({
    data: [
      { id: 'b-1', workerId: 'w-1', workerName: 'Vikram Singh', siteId: 'site-1', siteName: 'Skyline Heights, Tower A', bookingDate: '2026-06-08', dailyRate: 850, remarks: 'Masonry wall construction' },
      { id: 'b-2', workerId: 'w-6', workerName: 'Karan Johar', siteId: 'site-2', siteName: 'Riverview Luxury Villa', bookingDate: '2026-06-10', dailyRate: 1200, remarks: 'Supervisor duty for concreting' }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
