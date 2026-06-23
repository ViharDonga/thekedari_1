import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ConstructionSite {
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
}

export interface Worker {
  id: string;
  name: string;
  role: 'Mason' | 'Labour' | 'Supervisor' | 'Electrician' | 'Plumber' | 'Carpenter';
  dailyRate: number;
  siteId: string;
  advancePaid: number;
  balanceDue: number;
  statusToday: 'Present' | 'Absent' | 'Half Day' | 'Overtime' | 'Not Marked' | 'Not Called';
  overtimeHours: number;
  phone: string;
  avatar: string;
  employmentType: 'Permanent' | 'Casual';
}

export interface AttendanceRecord {
  id: string;
  date: string;
  workerId: string;
  siteId: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Overtime';
  overtimeHours: number;
  wageEarned: number;
}

export interface MaterialInventory {
  id: string;
  siteId: string;
  name: string;
  unit: string;
  stock: number;
  lowStockThreshold: number;
  lastUpdated: string;
}

export interface MaterialDelivery {
  id: string;
  siteId: string;
  materialName: string;
  supplierName: string;
  quantity: number;
  unit: string;
  ratePerUnit: number;
  totalAmount: number;
  status: 'Delivered' | 'Pending';
  date: string;
}

export interface RentalMaterial {
  id: string;
  siteId: string;
  name: string;
  size: string;
  quantity: number;
  ratePerDay: number;
  supplierName: string;
  startDate: string;
  endDate?: string;
}

export interface Transaction {
  id: string;
  workerId: string;
  workerName: string;
  siteId: string;
  amount: number;
  type: 'Wage Payment' | 'Advance Payment';
  date: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer';
}

export interface LabourBooking {
  id: string;
  workerId: string;
  workerName: string;
  siteId: string;
  siteName: string;
  bookingDate: string;
  dailyRate: number;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Current Date Simulation
  public todayString = '2026-06-02';

  // Connection State
  public isBackendOnline = signal<boolean>(false);

  // Signals
  public sites = signal<ConstructionSite[]>([]);
  public activeSiteId = signal<string>('');
  public workers = signal<Worker[]>([]);
  public materials = signal<MaterialInventory[]>([]);
  public deliveries = signal<MaterialDelivery[]>([]);
  public transactions = signal<Transaction[]>([]);
  public attendanceRecords = signal<AttendanceRecord[]>([]);
  public rentals = signal<RentalMaterial[]>([]);
  public bookings = signal<LabourBooking[]>([]);

  constructor() {
    this.loadAllData();
  }

  public loadAllData() {
    // Test backend connection by requesting sites
    this.http.get<ConstructionSite[]>(`${this.apiUrl}/sites`).subscribe({
      next: (sites) => {
        console.log('Backend is ONLINE. Syncing database records.');
        this.isBackendOnline.set(true);
        this.sites.set(sites);
        if (sites.length > 0 && !this.activeSiteId()) {
          this.activeSiteId.set(sites[0].id);
        }
        this.loadRemainingApiData();
      },
      error: (err) => {
        console.warn('Backend is OFFLINE. Loading local mock data fallback.', err.message);
        this.isBackendOnline.set(false);
        this.loadLocalMockData();
      }
    });
  }

  private loadRemainingApiData() {
    this.http.get<Worker[]>(`${this.apiUrl}/workers`).subscribe({
      next: (workers) => this.workers.set(workers),
      error: (err) => console.error('Failed to load workers:', err)
    });

    this.http.get<MaterialInventory[]>(`${this.apiUrl}/materials`).subscribe({
      next: (materials) => this.materials.set(materials),
      error: (err) => console.error('Failed to load materials:', err)
    });

    this.http.get<MaterialDelivery[]>(`${this.apiUrl}/deliveries`).subscribe({
      next: (deliveries) => this.deliveries.set(deliveries),
      error: (err) => console.error('Failed to load deliveries:', err)
    });

    this.http.get<Transaction[]>(`${this.apiUrl}/transactions`).subscribe({
      next: (transactions) => this.transactions.set(transactions),
      error: (err) => console.error('Failed to load transactions:', err)
    });

    this.http.get<AttendanceRecord[]>(`${this.apiUrl}/attendance`).subscribe({
      next: (attendance) => this.attendanceRecords.set(attendance),
      error: (err) => console.error('Failed to load attendance:', err)
    });

    this.http.get<RentalMaterial[]>(`${this.apiUrl}/rentals`).subscribe({
      next: (rentals) => this.rentals.set(rentals),
      error: (err) => console.error('Failed to load rentals:', err)
    });

    this.http.get<LabourBooking[]>(`${this.apiUrl}/bookings`).subscribe({
      next: (bookings) => this.bookings.set(bookings),
      error: (err) => console.error('Failed to load bookings:', err)
    });
  }

  private loadLocalMockData() {
    this.sites.set([
      {
        id: 'site-1',
        name: 'Skyline Heights, Tower A',
        location: 'Sector 62, Noida',
        budget: 4500000,
        spentWages: 320000,
        spentMaterials: 890000,
        spentRentals: 2000,
        otherExpenses: 45000,
        totalExpenses: 1257000,
        supervisorName: 'Rajesh Kumar'
      },
      {
        id: 'site-2',
        name: 'Riverview Luxury Villa',
        location: 'Jubilee Hills, Hyderabad',
        budget: 2500000,
        spentWages: 180000,
        spentMaterials: 420000,
        spentRentals: 1250,
        otherExpenses: 25000,
        totalExpenses: 626250,
        supervisorName: 'S. Srinivasan'
      },
      {
        id: 'site-3',
        name: 'Greenwood Row Houses',
        location: 'Whitefield, Bangalore',
        budget: 8000000,
        spentWages: 450000,
        spentMaterials: 1200000,
        spentRentals: 0,
        otherExpenses: 80000,
        totalExpenses: 1730000,
        supervisorName: 'Amit Patel'
      }
    ]);

    if (!this.activeSiteId()) {
      this.activeSiteId.set('site-1');
    }

    this.workers.set([
      { id: 'w-1', name: 'Vikram Singh', role: 'Mason', dailyRate: 850, siteId: 'site-1', advancePaid: 2000, balanceDue: 4500, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43210', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', employmentType: 'Permanent' },
      { id: 'w-2', name: 'Amit Yadav', role: 'Labour', dailyRate: 550, siteId: 'site-1', advancePaid: 1000, balanceDue: 2200, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43211', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', employmentType: 'Permanent' },
      { id: 'w-3', name: 'Sanjay Paswan', role: 'Labour', dailyRate: 550, siteId: 'site-1', advancePaid: 500, balanceDue: 2750, statusToday: 'Not Called', overtimeHours: 0, phone: '+91 98765 43212', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', employmentType: 'Casual' },
      { id: 'w-4', name: 'Ramesh Lal', role: 'Mason', dailyRate: 850, siteId: 'site-1', advancePaid: 1500, balanceDue: 3400, statusToday: 'Overtime', overtimeHours: 2, phone: '+91 98765 43213', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', employmentType: 'Permanent' },
      { id: 'w-5', name: 'Vinod Sharma', role: 'Plumber', dailyRate: 750, siteId: 'site-1', advancePaid: 0, balanceDue: 5250, statusToday: 'Not Called', overtimeHours: 0, phone: '+91 98765 43214', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', employmentType: 'Casual' },
      { id: 'w-6', name: 'Karan Johar', role: 'Supervisor', dailyRate: 1200, siteId: 'site-2', advancePaid: 5000, balanceDue: 8400, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43215', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', employmentType: 'Permanent' },
      { id: 'w-7', name: 'Mukesh Ram', role: 'Labour', dailyRate: 500, siteId: 'site-2', advancePaid: 800, balanceDue: 1500, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43216', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', employmentType: 'Permanent' },
      { id: 'w-8', name: 'Harish Rawat', role: 'Mason', dailyRate: 800, siteId: 'site-2', advancePaid: 2000, balanceDue: 3200, statusToday: 'Half Day', overtimeHours: 0, phone: '+91 98765 43217', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', employmentType: 'Casual' },
      { id: 'w-9', name: 'Sunil Dutt', role: 'Supervisor', dailyRate: 1300, siteId: 'site-3', advancePaid: 4000, balanceDue: 12000, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43218', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', employmentType: 'Permanent' },
      { id: 'w-10', name: 'Suresh Kumar', role: 'Electrician', dailyRate: 800, siteId: 'site-3', advancePaid: 1500, balanceDue: 4800, statusToday: 'Present', overtimeHours: 0, phone: '+91 98765 43219', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', employmentType: 'Permanent' },
      { id: 'w-11', name: 'Madan Mohan', role: 'Labour', dailyRate: 550, siteId: 'site-3', advancePaid: 500, balanceDue: 2200, statusToday: 'Absent', overtimeHours: 0, phone: '+91 98765 43220', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', employmentType: 'Casual' }
    ]);

    this.materials.set([
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
    ]);

    this.deliveries.set([
      { id: 'del-1', siteId: 'site-1', materialName: 'Cement (UltraTech)', supplierName: 'Balaji Building Materials', quantity: 200, unit: 'Bags', ratePerUnit: 420, totalAmount: 84000, status: 'Delivered', date: '2026-06-02' },
      { id: 'del-2', siteId: 'site-1', materialName: 'Steel (Jindal Panther)', supplierName: 'Aggarwal Steels', quantity: 5.5, unit: 'Tons', ratePerUnit: 62000, totalAmount: 341000, status: 'Delivered', date: '2026-06-01' },
      { id: 'del-3', siteId: 'site-1', materialName: 'Sand (River Sand)', supplierName: 'Choudhary Suppliers', quantity: 10, unit: 'Brass', ratePerUnit: 6500, totalAmount: 65000, status: 'Delivered', date: '2026-05-28' },
      { id: 'del-4', siteId: 'site-1', materialName: 'Bricks (Red Clay)', supplierName: 'Sagar Brick Kiln', quantity: 10000, unit: 'Pcs', ratePerUnit: 7, totalAmount: 70000, status: 'Pending', date: '2026-06-03' },
      { id: 'del-5', siteId: 'site-2', materialName: 'Cement (Ambuja)', supplierName: 'Deccan Cements Ltd', quantity: 100, unit: 'Bags', ratePerUnit: 400, totalAmount: 40000, status: 'Delivered', date: '2026-06-02' },
      { id: 'del-6', siteId: 'site-3', materialName: 'Steel (Jindal Panther)', supplierName: 'Karnataka Steel House', quantity: 10, unit: 'Tons', ratePerUnit: 60500, totalAmount: 605000, status: 'Delivered', date: '2026-06-02' }
    ]);

    this.transactions.set([
      { id: 'tx-1', workerId: 'w-1', workerName: 'Vikram Singh', siteId: 'site-1', amount: 5000, type: 'Wage Payment', date: '2026-05-30', paymentMode: 'UPI' },
      { id: 'tx-2', workerId: 'w-1', workerName: 'Vikram Singh', siteId: 'site-1', amount: 1000, type: 'Advance Payment', date: '2026-06-01', paymentMode: 'Cash' },
      { id: 'tx-3', workerId: 'w-2', workerName: 'Amit Yadav', siteId: 'site-1', amount: 3000, type: 'Wage Payment', date: '2026-05-30', paymentMode: 'Bank Transfer' },
      { id: 'tx-4', workerId: 'w-6', workerName: 'Karan Johar', siteId: 'site-2', amount: 8000, type: 'Wage Payment', date: '2026-05-31', paymentMode: 'UPI' },
      { id: 'tx-5', workerId: 'w-9', workerName: 'Sunil Dutt', siteId: 'site-3', amount: 12000, type: 'Wage Payment', date: '2026-05-31', paymentMode: 'Bank Transfer' }
    ]);

    this.attendanceRecords.set([
      { id: 'att-1', date: '2026-06-02', workerId: 'w-1', siteId: 'site-1', status: 'Present', overtimeHours: 0, wageEarned: 850 },
      { id: 'att-2', date: '2026-06-02', workerId: 'w-2', siteId: 'site-1', status: 'Present', overtimeHours: 0, wageEarned: 550 },
      { id: 'att-4', date: '2026-06-02', workerId: 'w-4', siteId: 'site-1', status: 'Overtime', overtimeHours: 2, wageEarned: 1062.5 },
      { id: 'att-6', date: '2026-06-02', workerId: 'w-6', siteId: 'site-2', status: 'Present', overtimeHours: 0, wageEarned: 1200 },
      { id: 'att-7', date: '2026-06-02', workerId: 'w-7', siteId: 'site-2', status: 'Present', overtimeHours: 0, wageEarned: 500 },
      { id: 'att-8', date: '2026-06-02', workerId: 'w-8', siteId: 'site-2', status: 'Half Day', overtimeHours: 0, wageEarned: 400 },
      { id: 'att-9', date: '2026-06-02', workerId: 'w-9', siteId: 'site-3', status: 'Present', overtimeHours: 0, wageEarned: 1300 },
      { id: 'att-10', date: '2026-06-02', workerId: 'w-10', siteId: 'site-3', status: 'Present', overtimeHours: 0, wageEarned: 800 },
      { id: 'att-11', date: '2026-06-02', workerId: 'w-11', siteId: 'site-3', status: 'Absent', overtimeHours: 0, wageEarned: 0 }
    ]);

    this.rentals.set([
      { id: 'r-1', siteId: 'site-1', name: 'Steel Plate', size: '3*3', quantity: 200, ratePerDay: 10, supplierName: 'Balaji Rentals', startDate: '2026-06-01' },
      { id: 'r-2', siteId: 'site-2', name: 'Scaffolding Pipes', size: '20ft', quantity: 50, ratePerDay: 5, supplierName: 'Metro Scaffolding', startDate: '2026-05-28', endDate: '2026-06-02' }
    ]);

    this.bookings.set([
      { id: 'b-1', workerId: 'w-1', workerName: 'Vikram Singh', siteId: 'site-1', siteName: 'Skyline Heights, Tower A', bookingDate: '2026-06-08', dailyRate: 850, remarks: 'Masonry wall construction' },
      { id: 'b-2', workerId: 'w-6', workerName: 'Karan Johar', siteId: 'site-2', siteName: 'Riverview Luxury Villa', bookingDate: '2026-06-10', dailyRate: 1200, remarks: 'Supervisor duty for concreting' }
    ]);
  }

  // Computed State Signals
  public activeSite = computed(() => {
    const active = this.sites().find(s => s.id === this.activeSiteId()) || this.sites()[0];
    if (active) return active;
    return {
      id: '',
      name: 'Loading...',
      location: '',
      budget: 0,
      spentWages: 0,
      spentMaterials: 0,
      spentRentals: 0,
      otherExpenses: 0,
      totalExpenses: 0,
      supervisorName: ''
    };
  });

  public activeSiteWorkers = computed(() => {
    return this.workers().filter(w => w.siteId === this.activeSiteId());
  });

  public activeSiteMaterials = computed(() => {
    return this.materials().filter(m => m.siteId === this.activeSiteId());
  });

  public activeSiteDeliveries = computed(() => {
    return this.deliveries().filter(d => d.siteId === this.activeSiteId());
  });

  public activeSiteTransactions = computed(() => {
    return this.transactions().filter(t => t.siteId === this.activeSiteId());
  });

  public activeSiteRentals = computed(() => {
    return this.rentals().filter(r => r.siteId === this.activeSiteId());
  });

  public todayActiveLabourCount = computed(() => {
    return this.activeSiteWorkers().filter(w => 
      w.statusToday === 'Present' || w.statusToday === 'Half Day' || w.statusToday === 'Overtime'
    ).length;
  });

  public todayWagesExpense = computed(() => {
    let wages = 0;
    this.activeSiteWorkers().forEach(w => {
      if (w.statusToday === 'Present') {
        wages += w.dailyRate;
      } else if (w.statusToday === 'Half Day') {
        wages += w.dailyRate * 0.5;
      } else if (w.statusToday === 'Overtime') {
        wages += w.dailyRate + (w.overtimeHours * (w.dailyRate / 8));
      }
    });
    return wages;
  });

  // State Modifying Actions
  public selectSite(id: string) {
    this.activeSiteId.set(id);
  }

  public updateWorkerAttendance(workerId: string, status: 'Present' | 'Absent' | 'Half Day' | 'Overtime' | 'Not Marked' | 'Not Called', overtimeHours: number = 0, date: string = this.todayString) {
    if (this.isBackendOnline()) {
      this.http.patch(`${this.apiUrl}/attendance`, { workerId, status, overtimeHours, date }).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to update attendance:', err)
      });
    } else {
      this.workers.update(prevWorkers => {
        return prevWorkers.map(w => {
          if (w.id === workerId) {
            const existingRecord = this.attendanceRecords().find(r => r.workerId === workerId && r.date === date);
            const oldStatus = existingRecord ? existingRecord.status : (w.employmentType === 'Permanent' ? 'Not Marked' : 'Not Called');
            const oldOvertime = existingRecord ? existingRecord.overtimeHours : 0;

            const oldWage = this.calculateWage(w.dailyRate, oldStatus, oldOvertime);
            const newWage = this.calculateWage(w.dailyRate, status, overtimeHours);
            const wageDiff = newWage - oldWage;

            const isToday = date === this.todayString;
            return {
              ...w,
              statusToday: isToday ? status : w.statusToday,
              overtimeHours: isToday ? (status === 'Overtime' ? overtimeHours : 0) : w.overtimeHours,
              balanceDue: w.balanceDue + wageDiff
            };
          }
          return w;
        });
      });

      this.attendanceRecords.update(prevRecords => {
        const existingRecordIndex = prevRecords.findIndex(r => r.workerId === workerId && r.date === date);
        const worker = this.workers().find(w => w.id === workerId)!;
        const wageEarned = this.calculateWage(worker.dailyRate, status, overtimeHours);

        if (existingRecordIndex > -1) {
          if (status === 'Not Marked' || status === 'Not Called') {
            return prevRecords.filter((_, i) => i !== existingRecordIndex);
          }
          return prevRecords.map((r, i) => i === existingRecordIndex ? {
            ...r,
            status: status as any,
            overtimeHours: status === 'Overtime' ? overtimeHours : 0,
            wageEarned
          } : r);
        } else {
          if (status === 'Not Marked' || status === 'Not Called') return prevRecords;
          return [
            ...prevRecords,
            {
              id: `att-${Date.now()}`,
              date: date,
              workerId,
              siteId: worker.siteId,
              status: status as any,
              overtimeHours: status === 'Overtime' ? overtimeHours : 0,
              wageEarned
            }
          ];
        }
      });

      this.recalculateSiteExpenses(this.activeSiteId());
    }
  }

  public payWorker(workerId: string, amount: number, paymentMode: 'Cash' | 'UPI' | 'Bank Transfer', type: 'Wage Payment' | 'Advance Payment' = 'Wage Payment') {
    if (this.isBackendOnline()) {
      this.http.post(`${this.apiUrl}/payments`, { workerId, amount, paymentMode, type }).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to pay worker:', err)
      });
    } else {
      const worker = this.workers().find(w => w.id === workerId)!;
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        workerId,
        workerName: worker.name,
        siteId: worker.siteId,
        amount,
        type,
        date: this.todayString,
        paymentMode
      };
      
      this.transactions.update(prev => [newTx, ...prev]);

      this.workers.update(prevWorkers => {
        return prevWorkers.map(w => {
          if (w.id === workerId) {
            if (type === 'Wage Payment') {
              return {
                ...w,
                balanceDue: Math.max(0, w.balanceDue - amount)
              };
            } else {
              return {
                ...w,
                advancePaid: w.advancePaid + amount
              };
            }
          }
          return w;
        });
      });

      this.recalculateSiteExpenses(worker.siteId);
    }
  }

  public getRentalDays(startDate: string, endDate?: string): number {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(this.todayString);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays); // Minimum 1 day rent
  }

  public calculateRentalCost(item: RentalMaterial): number {
    const days = this.getRentalDays(item.startDate, item.endDate);
    return item.quantity * item.ratePerDay * days;
  }

  public addRentalMaterial(name: string, size: string, quantity: number, ratePerDay: number, supplierName: string, startDate: string) {
    if (this.isBackendOnline()) {
      const siteId = this.activeSiteId();
      this.http.post(`${this.apiUrl}/rentals`, { name, size, quantity, ratePerDay, supplierName, startDate, siteId }).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to add rental material:', err)
      });
    } else {
      const siteId = this.activeSiteId();
      const newRental: RentalMaterial = {
        id: `r-${Date.now()}`,
        siteId,
        name,
        size,
        quantity,
        ratePerDay,
        supplierName,
        startDate
      };
      this.rentals.update(prev => [newRental, ...prev]);
      this.recalculateSiteExpenses(siteId);
    }
  }

  public returnRentalMaterial(rentalId: string, endDate: string) {
    if (this.isBackendOnline()) {
      this.http.patch(`${this.apiUrl}/rentals/${rentalId}/return`, { endDate }).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to return rental material:', err)
      });
    } else {
      let siteId = this.activeSiteId();
      this.rentals.update(prev => prev.map(r => {
        if (r.id === rentalId) {
          siteId = r.siteId;
          return { ...r, endDate };
        }
        return r;
      }));
      this.recalculateSiteExpenses(siteId);
    }
  }

  public deleteRentalMaterial(rentalId: string) {
    if (this.isBackendOnline()) {
      this.http.delete(`${this.apiUrl}/rentals/${rentalId}`).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to delete rental material:', err)
      });
    } else {
      let siteId = this.activeSiteId();
      const rentalItem = this.rentals().find(r => r.id === rentalId);
      if (rentalItem) {
        siteId = rentalItem.siteId;
      }
      this.rentals.update(prev => prev.filter(r => r.id !== rentalId));
      this.recalculateSiteExpenses(siteId);
    }
  }

  public receiveMaterial(materialName: string, supplierName: string, quantity: number, unit: string, ratePerUnit: number) {
    if (this.isBackendOnline()) {
      const siteId = this.activeSiteId();
      this.http.post(`${this.apiUrl}/deliveries`, { siteId, materialName, supplierName, quantity, unit, ratePerUnit }).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to receive material:', err)
      });
    } else {
      const siteId = this.activeSiteId();
      const newDelivery: MaterialDelivery = {
        id: `del-${Date.now()}`,
        siteId,
        materialName,
        supplierName,
        quantity,
        unit,
        ratePerUnit,
        totalAmount: quantity * ratePerUnit,
        status: 'Delivered',
        date: this.todayString
      };
      this.deliveries.update(prev => [newDelivery, ...prev]);

      this.materials.update(prevMaterials => {
        const match = prevMaterials.find(m => m.siteId === siteId && m.name.toLowerCase().includes(materialName.split(' ')[0].toLowerCase()));
        if (match) {
          return prevMaterials.map(m => m.id === match.id ? {
            ...m,
            stock: m.stock + quantity,
            lastUpdated: this.todayString
          } : m);
        } else {
          const newInventoryItem: MaterialInventory = {
            id: `m-${Date.now()}`,
            siteId,
            name: materialName,
            unit,
            stock: quantity,
            lowStockThreshold: 10,
            lastUpdated: this.todayString
          };
          return [...prevMaterials, newInventoryItem];
        }
      });

      this.sites.update(prevSites => {
        return prevSites.map(s => {
          if (s.id === siteId) {
            const newSpentMaterials = s.spentMaterials + (quantity * ratePerUnit);
            const rentalsTotal = this.rentals()
              .filter(r => r.siteId === siteId)
              .reduce((sum, r) => sum + this.calculateRentalCost(r), 0);
            return {
              ...s,
              spentMaterials: newSpentMaterials,
              spentRentals: rentalsTotal,
              totalExpenses: s.spentWages + newSpentMaterials + rentalsTotal + s.otherExpenses
            };
          }
          return s;
        });
      });
    }
  }

  public addLabourBooking(workerId: string, siteId: string, bookingDate: string, dailyRate: number, remarks: string) {
    if (this.isBackendOnline()) {
      this.http.post(`${this.apiUrl}/bookings`, { workerId, siteId, bookingDate, dailyRate, remarks }).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to add labour booking:', err)
      });
    } else {
      const worker = this.workers().find(w => w.id === workerId);
      const site = this.sites().find(s => s.id === siteId);
      if (!worker || !site) return;

      const newBooking: LabourBooking = {
        id: `b-${Date.now()}`,
        workerId,
        workerName: worker.name,
        siteId,
        siteName: site.name,
        bookingDate,
        dailyRate,
        remarks
      };
      this.bookings.update(prev => [newBooking, ...prev]);
    }
  }

  public cancelLabourBooking(bookingId: string) {
    if (this.isBackendOnline()) {
      this.http.delete(`${this.apiUrl}/bookings/${bookingId}`).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to cancel booking:', err)
      });
    } else {
      this.bookings.update(prev => prev.filter(b => b.id !== bookingId));
    }
  }

  public addWorker(name: string, role: Worker['role'], dailyRate: number, siteId: string, phone: string, employmentType: 'Permanent' | 'Casual') {
    if (this.isBackendOnline()) {
      this.http.post(`${this.apiUrl}/workers`, { name, role, dailyRate, siteId, phone, employmentType }).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to add worker:', err)
      });
    } else {
      const newWorker: Worker = {
        id: `w-${Date.now()}`,
        name,
        role,
        dailyRate,
        siteId,
        advancePaid: 0,
        balanceDue: 0,
        statusToday: employmentType === 'Permanent' ? 'Not Marked' : 'Not Called',
        overtimeHours: 0,
        phone,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*1000000)}?w=150`,
        employmentType
      };
      this.workers.update(prev => [...prev, newWorker]);
    }
  }

  private calculateWage(dailyRate: number, status: string, overtimeHours: number): number {
    if (status === 'Present') return dailyRate;
    if (status === 'Half Day') return dailyRate * 0.5;
    if (status === 'Overtime') return dailyRate + (overtimeHours * (dailyRate / 8));
    return 0; // Absent or Not Marked
  }

  private recalculateSiteExpenses(siteId: string) {
    const wageLogsTotal = this.attendanceRecords()
      .filter(r => r.siteId === siteId)
      .reduce((sum, r) => sum + r.wageEarned, 0);

    const baseWagesSpent = siteId === 'site-1' ? 318000 : siteId === 'site-2' ? 178000 : 448000;
    const computedWagesExpense = baseWagesSpent + wageLogsTotal;

    const rentalsTotal = this.rentals()
      .filter(r => r.siteId === siteId)
      .reduce((sum, r) => sum + this.calculateRentalCost(r), 0);

    this.sites.update(prevSites => {
      return prevSites.map(s => {
        if (s.id === siteId) {
          return {
            ...s,
            spentWages: computedWagesExpense,
            spentRentals: rentalsTotal,
            totalExpenses: computedWagesExpense + s.spentMaterials + rentalsTotal + s.otherExpenses
          };
        }
        return s;
      });
    });
  }
}
