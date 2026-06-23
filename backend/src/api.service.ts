import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtPayload } from './auth.service';

@Injectable()
export class ApiService {
  private get todayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  constructor(private prisma: PrismaService) {}

  private assertSiteAccess(user: JwtPayload, siteId: string) {
    if (user.role === 'ADMIN') return;
    if (user.siteId !== siteId) {
      throw new ForbiddenException('You do not have access to this site');
    }
  }

  private filterBySite<T extends { siteId: string }>(items: T[], user: JwtPayload): T[] {
    if (user.role === 'ADMIN') return items;
    if (!user.siteId) return [];
    return items.filter((item) => item.siteId === user.siteId);
  }

  private filterWorkersByRole<T extends { id: string; siteId: string }>(workers: T[], user: JwtPayload): T[] {
    if (user.role === 'ADMIN') return workers;
    if (user.role === 'LABOUR' && user.workerId) {
      return workers.filter((w) => w.id === user.workerId);
    }
    return this.filterBySite(workers, user);
  }

  // --- GET ALL DATA ---
  async getSites(user: JwtPayload) {
    const sites = await this.prisma.constructionSite.findMany({
      orderBy: { id: 'asc' },
    });
    if (user.role === 'ADMIN') return sites;
    if (user.siteId) return sites.filter((s) => s.id === user.siteId);
    return [];
  }

  async addSite(
    data: { name: string; location: string; budget: number; supervisorName: string },
    _user: JwtPayload,
  ) {
    return this.prisma.constructionSite.create({
      data: {
        name: data.name,
        location: data.location,
        budget: data.budget,
        supervisorName: data.supervisorName,
        spentWages: 0,
        spentMaterials: 0,
        spentRentals: 0,
        otherExpenses: 0,
        totalExpenses: 0,
      },
    });
  }

  async getWorkers(user: JwtPayload) {
    const workers = await this.prisma.worker.findMany({
      orderBy: { name: 'asc' },
    });
    return this.filterWorkersByRole(workers, user);
  }

  async getMaterials(user: JwtPayload) {
    const materials = await this.prisma.materialInventory.findMany({
      orderBy: { name: 'asc' },
    });
    return this.filterBySite(materials, user);
  }

  async getDeliveries(user: JwtPayload) {
    const deliveries = await this.prisma.materialDelivery.findMany({
      orderBy: { date: 'desc' },
    });
    return this.filterBySite(deliveries, user);
  }

  async getTransactions(user: JwtPayload) {
    const transactions = await this.prisma.transaction.findMany({
      orderBy: { date: 'desc' },
    });
    if (user.role === 'LABOUR' && user.workerId) {
      return transactions.filter((t) => t.workerId === user.workerId);
    }
    return this.filterBySite(transactions, user);
  }

  async getAttendanceRecords(user: JwtPayload) {
    const records = await this.prisma.attendanceRecord.findMany({
      orderBy: { date: 'desc' },
    });
    if (user.role === 'LABOUR' && user.workerId) {
      return records.filter((r) => r.workerId === user.workerId);
    }
    return this.filterBySite(records, user);
  }

  async getRentals(user: JwtPayload) {
    const rentals = await this.prisma.rentalMaterial.findMany({
      orderBy: { startDate: 'desc' },
    });
    return this.filterBySite(rentals, user);
  }

  async getBookings(user: JwtPayload) {
    const bookings = await this.prisma.labourBooking.findMany({
      orderBy: { bookingDate: 'desc' },
    });
    if (user.role === 'LABOUR' && user.workerId) {
      return bookings.filter((b) => b.workerId === user.workerId);
    }
    return this.filterBySite(bookings, user);
  }

  // --- ACTIONS ---

  // Add Worker
  async addWorker(
    data: {
      name: string;
      role: string;
      dailyRate: number;
      siteId: string;
      phone: string;
      employmentType: string;
    },
    user: JwtPayload,
  ) {
    this.assertSiteAccess(user, data.siteId);
    const avatar = `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150`;
    const statusToday = data.employmentType === 'Permanent' ? 'Not Marked' : 'Not Called';

    const worker = await this.prisma.worker.create({
      data: {
        name: data.name,
        role: data.role,
        dailyRate: data.dailyRate,
        siteId: data.siteId,
        phone: data.phone,
        employmentType: data.employmentType,
        avatar,
        statusToday,
        balanceDue: 0,
        advancePaid: 0,
      },
    });

    return worker;
  }

  // Update Worker Attendance
  async updateWorkerAttendance(workerId: string, status: string, overtimeHours: number, date: string | undefined, user: JwtPayload) {
    const targetDate = date || this.todayString;
    const worker = await this.prisma.worker.findUnique({ where: { id: workerId } });
    if (!worker) throw new Error('Worker not found');
    this.assertSiteAccess(user, worker.siteId);

    // Handle Attendance Record
    const existingRecord = await this.prisma.attendanceRecord.findFirst({
      where: { workerId, date: targetDate },
    });

    const previousStatus = existingRecord ? existingRecord.status : (worker.employmentType === 'Permanent' ? 'Not Marked' : 'Not Called');
    const previousOvertime = existingRecord ? existingRecord.overtimeHours : 0;

    // Calculate wages
    const oldWage = this.calculateWage(worker.dailyRate, previousStatus, previousOvertime);
    const newWage = this.calculateWage(worker.dailyRate, status, overtimeHours);
    const wageDiff = newWage - oldWage;

    // Update Worker balance, and only update statusToday/overtimeHours if it is todayString
    const isToday = targetDate === this.todayString;
    const updateData: any = {
      balanceDue: {
        increment: wageDiff,
      },
    };
    if (isToday) {
      updateData.statusToday = status;
      updateData.overtimeHours = status === 'Overtime' ? overtimeHours : 0;
    }

    const updatedWorker = await this.prisma.worker.update({
      where: { id: workerId },
      data: updateData,
    });

    if (existingRecord) {
      if (status === 'Not Marked' || status === 'Not Called') {
        await this.prisma.attendanceRecord.delete({ where: { id: existingRecord.id } });
      } else {
        await this.prisma.attendanceRecord.update({
          where: { id: existingRecord.id },
          data: {
            status,
            overtimeHours: status === 'Overtime' ? overtimeHours : 0,
            wageEarned: newWage,
          },
        });
      }
    } else {
      if (status !== 'Not Marked' && status !== 'Not Called') {
        await this.prisma.attendanceRecord.create({
          data: {
            date: targetDate,
            workerId,
            siteId: worker.siteId,
            status,
            overtimeHours: status === 'Overtime' ? overtimeHours : 0,
            wageEarned: newWage,
          },
        });
      }
    }

    // Recalculate Site expenses
    await this.recalculateSiteExpenses(worker.siteId);

    return updatedWorker;
  }

  // Pay Worker
  async payWorker(workerId: string, amount: number, paymentMode: string, type: 'Wage Payment' | 'Advance Payment', user: JwtPayload) {
    const worker = await this.prisma.worker.findUnique({ where: { id: workerId } });
    if (!worker) throw new Error('Worker not found');
    this.assertSiteAccess(user, worker.siteId);

    // Create Transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        workerId,
        workerName: worker.name,
        siteId: worker.siteId,
        amount,
        type,
        date: this.todayString,
        paymentMode,
      },
    });

    // Update Worker balance
    let updateData: any = {};
    if (type === 'Wage Payment') {
      updateData.balanceDue = Math.max(0, worker.balanceDue - amount);
    } else {
      updateData.advancePaid = worker.advancePaid + amount;
    }

    await this.prisma.worker.update({
      where: { id: workerId },
      data: updateData,
    });

    // Recalculate site expenses
    await this.recalculateSiteExpenses(worker.siteId);

    return transaction;
  }

  // Delete Advance payment
  async deleteAdvanceTransaction(txId: string, user: JwtPayload) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: txId } });
    if (!tx) throw new Error('Transaction not found');
    this.assertSiteAccess(user, tx.siteId);

    const worker = await this.prisma.worker.findUnique({ where: { id: tx.workerId } });
    if (worker) {
      await this.prisma.worker.update({
        where: { id: worker.id },
        data: {
          advancePaid: Math.max(0, worker.advancePaid - tx.amount),
        },
      });
    }

    await this.prisma.transaction.delete({ where: { id: txId } });
    await this.recalculateSiteExpenses(tx.siteId);
    return { success: true };
  }

  // Add Rental Material
  async addRentalMaterial(
    data: {
      name: string;
      size: string;
      quantity: number;
      ratePerDay: number;
      supplierName: string;
      startDate: string;
      siteId: string;
    },
    user: JwtPayload,
  ) {
    this.assertSiteAccess(user, data.siteId);
    const rental = await this.prisma.rentalMaterial.create({
      data: {
        siteId: data.siteId,
        name: data.name,
        size: data.size,
        quantity: data.quantity,
        ratePerDay: data.ratePerDay,
        supplierName: data.supplierName,
        startDate: data.startDate,
      },
    });

    await this.recalculateSiteExpenses(data.siteId);
    return rental;
  }

  // Return Rental Material
  async returnRentalMaterial(rentalId: string, endDate: string, user: JwtPayload) {
    const rental = await this.prisma.rentalMaterial.findUnique({ where: { id: rentalId } });
    if (!rental) throw new Error('Rental not found');
    this.assertSiteAccess(user, rental.siteId);

    const updatedRental = await this.prisma.rentalMaterial.update({
      where: { id: rentalId },
      data: { endDate },
    });

    await this.recalculateSiteExpenses(rental.siteId);
    return updatedRental;
  }

  // Delete Rental Material
  async deleteRentalMaterial(rentalId: string, user: JwtPayload) {
    const rental = await this.prisma.rentalMaterial.findUnique({ where: { id: rentalId } });
    if (!rental) throw new Error('Rental not found');
    this.assertSiteAccess(user, rental.siteId);

    await this.prisma.rentalMaterial.delete({ where: { id: rentalId } });
    await this.recalculateSiteExpenses(rental.siteId);
    return { success: true };
  }

  // Receive Material
  async receiveMaterial(
    siteId: string,
    materialName: string,
    supplierName: string,
    quantity: number,
    unit: string,
    ratePerUnit: number,
    user: JwtPayload,
  ) {
    this.assertSiteAccess(user, siteId);
    // 1. Create delivery log
    const delivery = await this.prisma.materialDelivery.create({
      data: {
        siteId,
        materialName,
        supplierName,
        quantity,
        unit,
        ratePerUnit,
        totalAmount: quantity * ratePerUnit,
        status: 'Delivered',
        date: this.todayString,
      },
    });

    // 2. Update stock level
    const match = await this.prisma.materialInventory.findFirst({
      where: {
        siteId,
        name: {
          contains: materialName.split(' ')[0],
          mode: 'insensitive',
        },
      },
    });

    if (match) {
      await this.prisma.materialInventory.update({
        where: { id: match.id },
        data: {
          stock: match.stock + quantity,
          lastUpdated: this.todayString,
        },
      });
    } else {
      await this.prisma.materialInventory.create({
        data: {
          siteId,
          name: materialName,
          unit,
          stock: quantity,
          lowStockThreshold: 10,
          lastUpdated: this.todayString,
        },
      });
    }

    // 3. Recalculate Site expenses
    await this.recalculateSiteExpenses(siteId);

    return delivery;
  }

  // Add Labour Booking
  async addLabourBooking(
    data: {
      workerId: string;
      siteId: string;
      bookingDate: string;
      dailyRate: number;
      remarks: string;
    },
    user: JwtPayload,
  ) {
    this.assertSiteAccess(user, data.siteId);
    const worker = await this.prisma.worker.findUnique({ where: { id: data.workerId } });
    const site = await this.prisma.constructionSite.findUnique({ where: { id: data.siteId } });
    if (!worker || !site) throw new Error('Worker or Site not found');

    const booking = await this.prisma.labourBooking.create({
      data: {
        workerId: data.workerId,
        workerName: worker.name,
        siteId: data.siteId,
        siteName: site.name,
        bookingDate: data.bookingDate,
        dailyRate: data.dailyRate,
        remarks: data.remarks,
      },
    });

    return booking;
  }

  // Cancel Labour Booking
  async cancelLabourBooking(bookingId: string, user: JwtPayload) {
    const booking = await this.prisma.labourBooking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error('Booking not found');
    this.assertSiteAccess(user, booking.siteId);
    await this.prisma.labourBooking.delete({ where: { id: bookingId } });
    return { success: true };
  }

  // --- PRIVATE HELPERS ---

  private calculateWage(dailyRate: number, status: string, overtimeHours: number): number {
    if (status === 'Present') return dailyRate;
    if (status === 'Half Day') return dailyRate * 0.5;
    if (status === 'Overtime') return dailyRate + overtimeHours * (dailyRate / 8);
    return 0; // Absent, Not Marked, Not Called
  }

  private getRentalDays(startDate: string, endDate?: string): number {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(this.todayString);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays); // Minimum 1 day rent
  }

  private calculateRentalCost(quantity: number, ratePerDay: number, startDate: string, endDate?: string): number {
    const days = this.getRentalDays(startDate, endDate);
    return quantity * ratePerDay * days;
  }

  private async recalculateSiteExpenses(siteId: string) {
    const site = await this.prisma.constructionSite.findUnique({ where: { id: siteId } });
    if (!site) return;

    // 1. Recalculate Wages spent
    const attendanceRecords = await this.prisma.attendanceRecord.findMany({
      where: { siteId },
    });
    const wageLogsTotal = attendanceRecords.reduce((sum, r) => sum + r.wageEarned, 0);
    const spentWages = wageLogsTotal;

    // 2. Recalculate Materials spent
    const deliveries = await this.prisma.materialDelivery.findMany({
      where: { siteId, status: 'Delivered' },
    });
    const deliveryTotal = deliveries.reduce((sum, d) => sum + d.totalAmount, 0);
    const spentMaterials = deliveryTotal;

    // 3. Recalculate Rentals spent
    const rentals = await this.prisma.rentalMaterial.findMany({
      where: { siteId },
    });
    const spentRentals = rentals.reduce(
      (sum, r) => sum + this.calculateRentalCost(r.quantity, r.ratePerDay, r.startDate, r.endDate),
      0,
    );

    const totalExpenses = spentWages + spentMaterials + spentRentals + site.otherExpenses;

    await this.prisma.constructionSite.update({
      where: { id: siteId },
      data: {
        spentWages,
        spentMaterials,
        spentRentals,
        totalExpenses,
      },
    });
  }
}
