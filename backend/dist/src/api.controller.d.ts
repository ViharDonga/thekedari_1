import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { JwtPayload } from './auth.service';
export declare class ApiController {
    private readonly apiService;
    private readonly authService;
    constructor(apiService: ApiService, authService: AuthService);
    health(): {
        ok: boolean;
        service: string;
    };
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        token: string;
        user: import("./auth.service").AuthUser;
    }>;
    register(body: {
        username: string;
        password: string;
        name: string;
        role: 'SUPERVISOR' | 'LABOUR';
    }): Promise<{
        message: string;
        user: import("./auth.service").AuthUser;
    }>;
    listUsers(): Promise<{
        id: string;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        siteId: string;
        workerId: string;
        createdAt: Date;
    }[]>;
    assignUserSite(id: string, body: {
        siteId: string;
        workerId?: string;
    }): Promise<import("./auth.service").AuthUser>;
    getPublicSites(): Promise<{
        id: string;
        name: string;
        location: string;
    }[]>;
    getPublicWorkersBySite(siteId: string): Promise<{
        id: string;
        name: string;
        role: string;
        phone: string;
    }[]>;
    getProfile(user: JwtPayload): Promise<import("./auth.service").AuthUser>;
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
    addSite(user: JwtPayload, body: {
        name: string;
        location: string;
        budget: number;
        supervisorName: string;
    }): Promise<{
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
    updateSite(user: JwtPayload, id: string, body: {
        name?: string;
        location?: string;
        budget?: number;
        supervisorName?: string;
        otherExpenses?: number;
    }): Promise<{
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
    addWorker(user: JwtPayload, body: {
        name: string;
        role: string;
        dailyRate: number;
        siteId: string;
        phone: string;
        employmentType: string;
    }): Promise<{
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
    updateWorker(user: JwtPayload, id: string, body: {
        dailyRate?: number;
        name?: string;
        role?: string;
        phone?: string;
    }): Promise<{
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
    updateWorkerAttendance(user: JwtPayload, body: {
        workerId: string;
        status: string;
        overtimeHours: number;
        overtimeAmount?: number;
        date?: string;
    }): Promise<{
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
    payWorker(user: JwtPayload, body: {
        workerId: string;
        amount: number;
        paymentMode: string;
        type: 'Wage Payment' | 'Advance Payment';
    }): Promise<{
        id: string;
        siteId: string;
        workerId: string;
        date: string;
        workerName: string;
        amount: number;
        type: string;
        paymentMode: string;
    }>;
    deleteAdvanceTransaction(user: JwtPayload, id: string): Promise<{
        success: boolean;
    }>;
    addRentalMaterial(user: JwtPayload, body: {
        name: string;
        size: string;
        quantity: number;
        ratePerDay: number;
        supplierName: string;
        startDate: string;
        siteId: string;
    }): Promise<{
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
    returnRentalMaterial(user: JwtPayload, id: string, body: {
        endDate: string;
    }): Promise<{
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
    deleteRentalMaterial(user: JwtPayload, id: string): Promise<{
        success: boolean;
    }>;
    receiveMaterial(user: JwtPayload, body: {
        siteId: string;
        materialName: string;
        supplierName: string;
        quantity: number;
        unit: string;
        ratePerUnit: number;
    }): Promise<{
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
    addLabourBooking(user: JwtPayload, body: {
        workerId: string;
        siteId: string;
        bookingDate: string;
        dailyRate: number;
        remarks: string;
    }): Promise<{
        id: string;
        siteId: string;
        workerId: string;
        dailyRate: number;
        workerName: string;
        siteName: string;
        bookingDate: string;
        remarks: string;
    }>;
    cancelLabourBooking(user: JwtPayload, id: string): Promise<{
        success: boolean;
    }>;
}
