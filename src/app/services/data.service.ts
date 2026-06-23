import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
  private apiUrl = environment.apiUrl;

  // Current date (live)
  public get todayString(): string {
    return new Date().toISOString().split('T')[0];
  }

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

  public clearData() {
    this.isBackendOnline.set(false);
    this.sites.set([]);
    this.activeSiteId.set('');
    this.workers.set([]);
    this.materials.set([]);
    this.deliveries.set([]);
    this.transactions.set([]);
    this.attendanceRecords.set([]);
    this.rentals.set([]);
    this.bookings.set([]);
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
        console.warn('Backend is OFFLINE.', err.message);
        this.isBackendOnline.set(false);
        this.clearData();
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

  public addSite(name: string, location: string, budget: number, supervisorName: string) {
    if (this.isBackendOnline()) {
      this.http.post<ConstructionSite>(`${this.apiUrl}/sites`, {
        name,
        location,
        budget,
        supervisorName,
      }).subscribe({
        next: (site) => {
          this.loadAllData();
          this.activeSiteId.set(site.id);
        },
        error: (err) => console.error('Failed to add site:', err),
      });
    } else {
      const newSite: ConstructionSite = {
        id: `site-${Date.now()}`,
        name,
        location,
        budget,
        spentWages: 0,
        spentMaterials: 0,
        spentRentals: 0,
        otherExpenses: 0,
        totalExpenses: 0,
        supervisorName,
      };
      this.sites.update((prev) => [...prev, newSite]);
      this.activeSiteId.set(newSite.id);
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

    const computedWagesExpense = wageLogsTotal;

    const deliveryTotal = this.deliveries()
      .filter(d => d.siteId === siteId && d.status === 'Delivered')
      .reduce((sum, d) => sum + d.totalAmount, 0);

    const rentalsTotal = this.rentals()
      .filter(r => r.siteId === siteId)
      .reduce((sum, r) => sum + this.calculateRentalCost(r), 0);

    this.sites.update(prevSites => {
      return prevSites.map(s => {
        if (s.id === siteId) {
          return {
            ...s,
            spentWages: computedWagesExpense,
            spentMaterials: deliveryTotal,
            spentRentals: rentalsTotal,
            totalExpenses: computedWagesExpense + deliveryTotal + rentalsTotal + s.otherExpenses
          };
        }
        return s;
      });
    });
  }
}
