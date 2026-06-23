"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let ApiService = class ApiService {
    get todayString() {
        return new Date().toISOString().split('T')[0];
    }
    constructor(prisma) {
        this.prisma = prisma;
    }
    assertSiteAccess(user, siteId) {
        if (user.role === 'ADMIN')
            return;
        if (user.siteId !== siteId) {
            throw new common_1.ForbiddenException('You do not have access to this site');
        }
    }
    filterBySite(items, user) {
        if (user.role === 'ADMIN')
            return items;
        if (!user.siteId)
            return [];
        return items.filter((item) => item.siteId === user.siteId);
    }
    filterWorkersByRole(workers, user) {
        if (user.role === 'ADMIN')
            return workers;
        if (user.role === 'LABOUR' && user.workerId) {
            return workers.filter((w) => w.id === user.workerId);
        }
        return this.filterBySite(workers, user);
    }
    async getSites(user) {
        const sites = await this.prisma.constructionSite.findMany({
            orderBy: { id: 'asc' },
        });
        if (user.role === 'ADMIN')
            return sites;
        if (user.siteId)
            return sites.filter((s) => s.id === user.siteId);
        return [];
    }
    async addSite(data, _user) {
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
    async getWorkers(user) {
        const workers = await this.prisma.worker.findMany({
            orderBy: { name: 'asc' },
        });
        return this.filterWorkersByRole(workers, user);
    }
    async getMaterials(user) {
        const materials = await this.prisma.materialInventory.findMany({
            orderBy: { name: 'asc' },
        });
        return this.filterBySite(materials, user);
    }
    async getDeliveries(user) {
        const deliveries = await this.prisma.materialDelivery.findMany({
            orderBy: { date: 'desc' },
        });
        return this.filterBySite(deliveries, user);
    }
    async getTransactions(user) {
        const transactions = await this.prisma.transaction.findMany({
            orderBy: { date: 'desc' },
        });
        if (user.role === 'LABOUR' && user.workerId) {
            return transactions.filter((t) => t.workerId === user.workerId);
        }
        return this.filterBySite(transactions, user);
    }
    async getAttendanceRecords(user) {
        const records = await this.prisma.attendanceRecord.findMany({
            orderBy: { date: 'desc' },
        });
        if (user.role === 'LABOUR' && user.workerId) {
            return records.filter((r) => r.workerId === user.workerId);
        }
        return this.filterBySite(records, user);
    }
    async getRentals(user) {
        const rentals = await this.prisma.rentalMaterial.findMany({
            orderBy: { startDate: 'desc' },
        });
        return this.filterBySite(rentals, user);
    }
    async getBookings(user) {
        const bookings = await this.prisma.labourBooking.findMany({
            orderBy: { bookingDate: 'desc' },
        });
        if (user.role === 'LABOUR' && user.workerId) {
            return bookings.filter((b) => b.workerId === user.workerId);
        }
        return this.filterBySite(bookings, user);
    }
    async addWorker(data, user) {
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
    async updateWorkerAttendance(workerId, status, overtimeHours, date, user) {
        const targetDate = date || this.todayString;
        const worker = await this.prisma.worker.findUnique({ where: { id: workerId } });
        if (!worker)
            throw new Error('Worker not found');
        this.assertSiteAccess(user, worker.siteId);
        const existingRecord = await this.prisma.attendanceRecord.findFirst({
            where: { workerId, date: targetDate },
        });
        const previousStatus = existingRecord ? existingRecord.status : (worker.employmentType === 'Permanent' ? 'Not Marked' : 'Not Called');
        const previousOvertime = existingRecord ? existingRecord.overtimeHours : 0;
        const oldWage = this.calculateWage(worker.dailyRate, previousStatus, previousOvertime);
        const newWage = this.calculateWage(worker.dailyRate, status, overtimeHours);
        const wageDiff = newWage - oldWage;
        const isToday = targetDate === this.todayString;
        const updateData = {
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
            }
            else {
                await this.prisma.attendanceRecord.update({
                    where: { id: existingRecord.id },
                    data: {
                        status,
                        overtimeHours: status === 'Overtime' ? overtimeHours : 0,
                        wageEarned: newWage,
                    },
                });
            }
        }
        else {
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
        await this.recalculateSiteExpenses(worker.siteId);
        return updatedWorker;
    }
    async payWorker(workerId, amount, paymentMode, type, user) {
        const worker = await this.prisma.worker.findUnique({ where: { id: workerId } });
        if (!worker)
            throw new Error('Worker not found');
        this.assertSiteAccess(user, worker.siteId);
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
        let updateData = {};
        if (type === 'Wage Payment') {
            updateData.balanceDue = Math.max(0, worker.balanceDue - amount);
        }
        else {
            updateData.advancePaid = worker.advancePaid + amount;
        }
        await this.prisma.worker.update({
            where: { id: workerId },
            data: updateData,
        });
        await this.recalculateSiteExpenses(worker.siteId);
        return transaction;
    }
    async deleteAdvanceTransaction(txId, user) {
        const tx = await this.prisma.transaction.findUnique({ where: { id: txId } });
        if (!tx)
            throw new Error('Transaction not found');
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
    async addRentalMaterial(data, user) {
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
    async returnRentalMaterial(rentalId, endDate, user) {
        const rental = await this.prisma.rentalMaterial.findUnique({ where: { id: rentalId } });
        if (!rental)
            throw new Error('Rental not found');
        this.assertSiteAccess(user, rental.siteId);
        const updatedRental = await this.prisma.rentalMaterial.update({
            where: { id: rentalId },
            data: { endDate },
        });
        await this.recalculateSiteExpenses(rental.siteId);
        return updatedRental;
    }
    async deleteRentalMaterial(rentalId, user) {
        const rental = await this.prisma.rentalMaterial.findUnique({ where: { id: rentalId } });
        if (!rental)
            throw new Error('Rental not found');
        this.assertSiteAccess(user, rental.siteId);
        await this.prisma.rentalMaterial.delete({ where: { id: rentalId } });
        await this.recalculateSiteExpenses(rental.siteId);
        return { success: true };
    }
    async receiveMaterial(siteId, materialName, supplierName, quantity, unit, ratePerUnit, user) {
        this.assertSiteAccess(user, siteId);
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
        }
        else {
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
        await this.recalculateSiteExpenses(siteId);
        return delivery;
    }
    async addLabourBooking(data, user) {
        this.assertSiteAccess(user, data.siteId);
        const worker = await this.prisma.worker.findUnique({ where: { id: data.workerId } });
        const site = await this.prisma.constructionSite.findUnique({ where: { id: data.siteId } });
        if (!worker || !site)
            throw new Error('Worker or Site not found');
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
    async cancelLabourBooking(bookingId, user) {
        const booking = await this.prisma.labourBooking.findUnique({ where: { id: bookingId } });
        if (!booking)
            throw new Error('Booking not found');
        this.assertSiteAccess(user, booking.siteId);
        await this.prisma.labourBooking.delete({ where: { id: bookingId } });
        return { success: true };
    }
    calculateWage(dailyRate, status, overtimeHours) {
        if (status === 'Present')
            return dailyRate;
        if (status === 'Half Day')
            return dailyRate * 0.5;
        if (status === 'Overtime')
            return dailyRate + overtimeHours * (dailyRate / 8);
        return 0;
    }
    getRentalDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date(this.todayString);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays);
    }
    calculateRentalCost(quantity, ratePerDay, startDate, endDate) {
        const days = this.getRentalDays(startDate, endDate);
        return quantity * ratePerDay * days;
    }
    async recalculateSiteExpenses(siteId) {
        const site = await this.prisma.constructionSite.findUnique({ where: { id: siteId } });
        if (!site)
            return;
        const attendanceRecords = await this.prisma.attendanceRecord.findMany({
            where: { siteId },
        });
        const wageLogsTotal = attendanceRecords.reduce((sum, r) => sum + r.wageEarned, 0);
        const spentWages = wageLogsTotal;
        const deliveries = await this.prisma.materialDelivery.findMany({
            where: { siteId, status: 'Delivered' },
        });
        const deliveryTotal = deliveries.reduce((sum, d) => sum + d.totalAmount, 0);
        const spentMaterials = deliveryTotal;
        const rentals = await this.prisma.rentalMaterial.findMany({
            where: { siteId },
        });
        const spentRentals = rentals.reduce((sum, r) => sum + this.calculateRentalCost(r.quantity, r.ratePerDay, r.startDate, r.endDate), 0);
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
};
exports.ApiService = ApiService;
exports.ApiService = ApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApiService);
//# sourceMappingURL=api.service.js.map