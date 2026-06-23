import { ApiService } from './api.service';
export declare class ApiController {
    private readonly apiService;
    constructor(apiService: ApiService);
    getSites(): Promise<{
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
    getWorkers(): Promise<{
        id: string;
        name: string;
        role: string;
        dailyRate: number;
        siteId: string;
        advancePaid: number;
        balanceDue: number;
        statusToday: string;
        overtimeHours: number;
        phone: string;
        avatar: string;
        employmentType: string;
    }[]>;
    getMaterials(): Promise<{
        id: string;
        name: string;
        siteId: string;
        unit: string;
        stock: number;
        lowStockThreshold: number;
        lastUpdated: string;
    }[]>;
    getDeliveries(): Promise<{
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
    getTransactions(): Promise<{
        id: string;
        siteId: string;
        date: string;
        workerId: string;
        workerName: string;
        amount: number;
        type: string;
        paymentMode: string;
    }[]>;
    getAttendanceRecords(): Promise<{
        id: string;
        siteId: string;
        overtimeHours: number;
        status: string;
        date: string;
        workerId: string;
        wageEarned: number;
    }[]>;
    getRentals(): Promise<{
        id: string;
        name: string;
        endDate: string | null;
        siteId: string;
        supplierName: string;
        quantity: number;
        size: string;
        ratePerDay: number;
        startDate: string;
    }[]>;
    getBookings(): Promise<{
        id: string;
        dailyRate: number;
        siteId: string;
        workerId: string;
        workerName: string;
        siteName: string;
        bookingDate: string;
        remarks: string;
    }[]>;
    addWorker(body: {
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
        dailyRate: number;
        siteId: string;
        advancePaid: number;
        balanceDue: number;
        statusToday: string;
        overtimeHours: number;
        phone: string;
        avatar: string;
        employmentType: string;
    }>;
    updateWorkerAttendance(body: {
        workerId: string;
        status: string;
        overtimeHours: number;
        date?: string;
    }): Promise<{
        id: string;
        name: string;
        role: string;
        dailyRate: number;
        siteId: string;
        advancePaid: number;
        balanceDue: number;
        statusToday: string;
        overtimeHours: number;
        phone: string;
        avatar: string;
        employmentType: string;
    }>;
    payWorker(body: {
        workerId: string;
        amount: number;
        paymentMode: string;
        type: 'Wage Payment' | 'Advance Payment';
    }): Promise<{
        id: string;
        siteId: string;
        date: string;
        workerId: string;
        workerName: string;
        amount: number;
        type: string;
        paymentMode: string;
    }>;
    deleteAdvanceTransaction(id: string): Promise<{
        success: boolean;
    }>;
    addRentalMaterial(body: {
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
        endDate: string | null;
        siteId: string;
        supplierName: string;
        quantity: number;
        size: string;
        ratePerDay: number;
        startDate: string;
    }>;
    returnRentalMaterial(id: string, body: {
        endDate: string;
    }): Promise<{
        id: string;
        name: string;
        endDate: string | null;
        siteId: string;
        supplierName: string;
        quantity: number;
        size: string;
        ratePerDay: number;
        startDate: string;
    }>;
    deleteRentalMaterial(id: string): Promise<{
        success: boolean;
    }>;
    receiveMaterial(body: {
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
    addLabourBooking(body: {
        workerId: string;
        siteId: string;
        bookingDate: string;
        dailyRate: number;
        remarks: string;
    }): Promise<{
        id: string;
        dailyRate: number;
        siteId: string;
        workerId: string;
        workerName: string;
        siteName: string;
        bookingDate: string;
        remarks: string;
    }>;
    cancelLabourBooking(id: string): Promise<{
        success: boolean;
    }>;
}
