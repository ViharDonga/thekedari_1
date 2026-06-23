import { PrismaService } from './prisma.service';
import { JwtPayload } from './auth.service';
export declare class ApiService {
    private prisma;
    private get todayString();
    constructor(prisma: PrismaService);
    private assertSiteAccess;
    private filterBySite;
    private filterWorkersByRole;
    getSites(user: JwtPayload): Promise<{
        id: string;
        name: string;
        location: string;
        budget: number;
        spentWages: number;
        spentMaterials: number;
        spentRentals: number;
        otherExpenses: number;
        totalExpenses: number;
        supervisorName: string;
    }[]>;
    addSite(data: {
        name: string;
        location: string;
        budget: number;
        supervisorName: string;
    }, _user: JwtPayload): Promise<{
        id: string;
        name: string;
        location: string;
        budget: number;
        spentWages: number;
        spentMaterials: number;
        spentRentals: number;
        otherExpenses: number;
        totalExpenses: number;
        supervisorName: string;
    }>;
    getWorkers(user: JwtPayload): Promise<{
        id: string;
        name: string;
        role: string;
        siteId: string;
        dailyRate: number;
        advancePaid: number;
        balanceDue: number;
        statusToday: string;
        overtimeHours: number;
        phone: string;
        avatar: string;
        employmentType: string;
    }[]>;
    getMaterials(user: JwtPayload): Promise<{
        id: string;
        name: string;
        siteId: string;
        unit: string;
        stock: number;
        lowStockThreshold: number;
        lastUpdated: string;
    }[]>;
    getDeliveries(user: JwtPayload): Promise<{
        id: string;
        siteId: string;
        unit: string;
        materialName: string;
        supplierName: string;
        quantity: number;
        ratePerUnit: number;
        totalAmount: number;
        status: string;
        date: string;
    }[]>;
    getTransactions(user: JwtPayload): Promise<{
        id: string;
        siteId: string;
        workerId: string;
        date: string;
        workerName: string;
        amount: number;
        type: string;
        paymentMode: string;
    }[]>;
    getAttendanceRecords(user: JwtPayload): Promise<{
        id: string;
        siteId: string;
        workerId: string;
        overtimeHours: number;
        status: string;
        date: string;
        wageEarned: number;
    }[]>;
    getRentals(user: JwtPayload): Promise<{
        id: string;
        name: string;
        siteId: string;
        supplierName: string;
        quantity: number;
        size: string;
        ratePerDay: number;
        startDate: string;
        endDate: string | null;
    }[]>;
    getBookings(user: JwtPayload): Promise<{
        id: string;
        siteId: string;
        workerId: string;
        dailyRate: number;
        workerName: string;
        siteName: string;
        bookingDate: string;
        remarks: string;
    }[]>;
    addWorker(data: {
        name: string;
        role: string;
        dailyRate: number;
        siteId: string;
        phone: string;
        employmentType: string;
    }, user: JwtPayload): Promise<{
        id: string;
        name: string;
        role: string;
        siteId: string;
        dailyRate: number;
        advancePaid: number;
        balanceDue: number;
        statusToday: string;
        overtimeHours: number;
        phone: string;
        avatar: string;
        employmentType: string;
    }>;
    updateWorker(workerId: string, data: {
        dailyRate?: number;
        name?: string;
        role?: string;
        phone?: string;
    }, user: JwtPayload): Promise<{
        id: string;
        name: string;
        role: string;
        siteId: string;
        dailyRate: number;
        advancePaid: number;
        balanceDue: number;
        statusToday: string;
        overtimeHours: number;
        phone: string;
        avatar: string;
        employmentType: string;
    }>;
    updateSite(siteId: string, data: {
        name?: string;
        location?: string;
        budget?: number;
        supervisorName?: string;
        otherExpenses?: number;
    }, user: JwtPayload): Promise<{
        id: string;
        name: string;
        location: string;
        budget: number;
        spentWages: number;
        spentMaterials: number;
        spentRentals: number;
        otherExpenses: number;
        totalExpenses: number;
        supervisorName: string;
    }>;
    updateWorkerAttendance(workerId: string, status: string, overtimeHours: number, date: string | undefined, user: JwtPayload, overtimeAmount?: number): Promise<{
        id: string;
        name: string;
        role: string;
        siteId: string;
        dailyRate: number;
        advancePaid: number;
        balanceDue: number;
        statusToday: string;
        overtimeHours: number;
        phone: string;
        avatar: string;
        employmentType: string;
    }>;
    payWorker(workerId: string, amount: number, paymentMode: string, type: 'Wage Payment' | 'Advance Payment', user: JwtPayload): Promise<{
        id: string;
        siteId: string;
        workerId: string;
        date: string;
        workerName: string;
        amount: number;
        type: string;
        paymentMode: string;
    }>;
    deleteAdvanceTransaction(txId: string, user: JwtPayload): Promise<{
        success: boolean;
    }>;
    addRentalMaterial(data: {
        name: string;
        size: string;
        quantity: number;
        ratePerDay: number;
        supplierName: string;
        startDate: string;
        siteId: string;
    }, user: JwtPayload): Promise<{
        id: string;
        name: string;
        siteId: string;
        supplierName: string;
        quantity: number;
        size: string;
        ratePerDay: number;
        startDate: string;
        endDate: string | null;
    }>;
    returnRentalMaterial(rentalId: string, endDate: string, user: JwtPayload): Promise<{
        id: string;
        name: string;
        siteId: string;
        supplierName: string;
        quantity: number;
        size: string;
        ratePerDay: number;
        startDate: string;
        endDate: string | null;
    }>;
    deleteRentalMaterial(rentalId: string, user: JwtPayload): Promise<{
        success: boolean;
    }>;
    receiveMaterial(siteId: string, materialName: string, supplierName: string, quantity: number, unit: string, ratePerUnit: number, user: JwtPayload): Promise<{
        id: string;
        siteId: string;
        unit: string;
        materialName: string;
        supplierName: string;
        quantity: number;
        ratePerUnit: number;
        totalAmount: number;
        status: string;
        date: string;
    }>;
    addLabourBooking(data: {
        workerId: string;
        siteId: string;
        bookingDate: string;
        dailyRate: number;
        remarks: string;
    }, user: JwtPayload): Promise<{
        id: string;
        siteId: string;
        workerId: string;
        dailyRate: number;
        workerName: string;
        siteName: string;
        bookingDate: string;
        remarks: string;
    }>;
    cancelLabourBooking(bookingId: string, user: JwtPayload): Promise<{
        success: boolean;
    }>;
    private calculateWage;
    private getRentalDays;
    private calculateRentalCost;
    private recalculateSiteExpenses;
}
