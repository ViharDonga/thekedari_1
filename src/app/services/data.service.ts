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
  isActive: boolean;
}

export interface OtherExpense {
  id: string;
  siteId: string;
  name: string;
  amount: number;
  isActive: boolean;
  date: string;
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
  public otherExpenseItems = signal<OtherExpense[]>([]);
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
    this.otherExpenseItems.set([]);
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
      next: (transactions) => {
        this.transactions.set(transactions);
        this.refreshAllSiteExpenses();
      },
      error: (err) => console.error('Failed to load transactions:', err)
    });

    this.http.get<AttendanceRecord[]>(`${this.apiUrl}/attendance`).subscribe({
      next: (attendance) => {
        this.attendanceRecords.set(attendance);
        this.refreshAllSiteExpenses();
      },
      error: (err) => console.error('Failed to load attendance:', err)
    });

    this.http.get<RentalMaterial[]>(`${this.apiUrl}/rentals`).subscribe({
      next: (rentals) => {
        this.rentals.set(rentals.map((r) => ({ ...r, isActive: r.isActive !== false })));
        this.refreshAllSiteExpenses();
      },
      error: (err) => console.error('Failed to load rentals:', err)
    });

    this.http.get<OtherExpense[]>(`${this.apiUrl}/other-expenses`).subscribe({
      next: (items) => {
        this.otherExpenseItems.set(items.map((e) => ({ ...e, isActive: e.isActive !== false })));
        this.refreshAllSiteExpenses();
      },
      error: (err) => console.error('Failed to load other expenses:', err)
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
    return this.rentals().filter(r => r.siteId === this.activeSiteId() && r.isActive);
  });

  public inactiveSiteRentals = computed(() => {
    return this.rentals().filter(r => r.siteId === this.activeSiteId() && !r.isActive);
  });

  public activeSiteOtherExpenses = computed(() => {
    return this.otherExpenseItems().filter(e => e.siteId === this.activeSiteId() && e.isActive);
  });

  public inactiveSiteOtherExpenses = computed(() => {
    return this.otherExpenseItems().filter(e => e.siteId === this.activeSiteId() && !e.isActive);
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

  public updateWorkerAttendance(
    workerId: string,
    status: 'Present' | 'Absent' | 'Half Day' | 'Overtime' | 'Not Marked' | 'Not Called',
    overtimeHours: number = 0,
    date: string = this.todayString,
    overtimeAmount?: number,
    customWageEarned?: number,
  ) {
    if (this.isBackendOnline()) {
      const body: Record<string, unknown> = { workerId, status, overtimeHours, date };
      if (overtimeAmount !== undefined) {
        body['overtimeAmount'] = overtimeAmount;
      }
      if (customWageEarned !== undefined) {
        body['customWageEarned'] = customWageEarned;
      }
      this.http.patch(`${this.apiUrl}/attendance`, body).subscribe({
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

            const oldWage = existingRecord ? existingRecord.wageEarned : this.calculateWage(w.dailyRate, oldStatus, oldOvertime);
            const newWage =
              customWageEarned !== undefined && customWageEarned >= 0
                ? customWageEarned
                : this.calculateWage(w.dailyRate, status, overtimeHours, overtimeAmount);
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
        const wageEarned =
          customWageEarned !== undefined && customWageEarned >= 0
            ? customWageEarned
            : this.calculateWage(worker.dailyRate, status, overtimeHours, overtimeAmount);

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

  public payWorker(
    workerId: string,
    amount: number,
    paymentMode: 'Cash' | 'UPI' | 'Bank Transfer',
    type: 'Wage Payment' | 'Advance Payment' = 'Wage Payment',
    date: string = this.todayString,
  ) {
    if (this.isBackendOnline()) {
      this.http.post(`${this.apiUrl}/payments`, { workerId, amount, paymentMode, type, date }).subscribe({
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
        date: date,
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
        startDate,
        isActive: true,
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

  public setRentalMaterialActive(rentalId: string, isActive: boolean) {
    if (this.isBackendOnline()) {
      this.http.patch(`${this.apiUrl}/rentals/${rentalId}/active`, { isActive }).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to update rental status:', err)
      });
    } else {
      let siteId = this.activeSiteId();
      this.rentals.update(prev => prev.map(r => {
        if (r.id === rentalId) {
          siteId = r.siteId;
          return { ...r, isActive };
        }
        return r;
      }));
      this.recalculateSiteExpenses(siteId);
    }
  }

  public deleteRentalMaterial(rentalId: string) {
    this.setRentalMaterialActive(rentalId, false);
  }

  public addOtherExpense(name: string, amount: number, date?: string) {
    if (this.isBackendOnline()) {
      const siteId = this.activeSiteId();
      this.http.post(`${this.apiUrl}/other-expenses`, { siteId, name, amount, date }).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to add other expense:', err)
      });
    } else {
      const siteId = this.activeSiteId();
      const item: OtherExpense = {
        id: `oe-${Date.now()}`,
        siteId,
        name,
        amount,
        isActive: true,
        date: date || this.todayString,
      };
      this.otherExpenseItems.update(prev => [item, ...prev]);
      this.recalculateSiteExpenses(siteId);
    }
  }

  public updateOtherExpense(expenseId: string, data: { name?: string; amount?: number; isActive?: boolean }) {
    if (this.isBackendOnline()) {
      this.http.patch(`${this.apiUrl}/other-expenses/${expenseId}`, data).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to update other expense:', err)
      });
    } else {
      let siteId = this.activeSiteId();
      this.otherExpenseItems.update(prev => prev.map(e => {
        if (e.id === expenseId) {
          siteId = e.siteId;
          return { ...e, ...data };
        }
        return e;
      }));
      this.recalculateSiteExpenses(siteId);
    }
  }

  public setOtherExpenseActive(expenseId: string, isActive: boolean) {
    this.updateOtherExpense(expenseId, { isActive });
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
              .filter(r => r.siteId === siteId && r.isActive)
              .reduce((sum, r) => sum + this.calculateRentalCost(r), 0);
            const otherTotal = this.otherExpenseItems()
              .filter(e => e.siteId === siteId && e.isActive)
              .reduce((sum, e) => sum + e.amount, 0);
            return {
              ...s,
              spentMaterials: newSpentMaterials,
              spentRentals: rentalsTotal,
              otherExpenses: otherTotal,
              totalExpenses: s.spentWages + newSpentMaterials + rentalsTotal + otherTotal
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
        avatar: '',
        employmentType
      };
      this.workers.update(prev => [...prev, newWorker]);
    }
  }

  public updateWorker(
    workerId: string,
    data: { dailyRate?: number; name?: string; role?: string; phone?: string },
  ) {
    if (this.isBackendOnline()) {
      this.http.patch<Worker>(`${this.apiUrl}/workers/${workerId}`, data).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to update worker:', err),
      });
    } else {
      this.workers.update((prev) =>
        prev.map((w) => (w.id === workerId ? { ...w, ...data } as Worker : w)),
      );
      if (data.dailyRate !== undefined) {
        const worker = this.workers().find((w) => w.id === workerId);
        if (worker) {
          this.recalculateSiteExpenses(worker.siteId);
        }
      }
    }
  }

  public updateSite(
    siteId: string,
    data: {
      name?: string;
      location?: string;
      budget?: number;
      supervisorName?: string;
    },
  ) {
    if (this.isBackendOnline()) {
      this.http.patch<ConstructionSite>(`${this.apiUrl}/sites/${siteId}`, data).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error('Failed to update site:', err),
      });
    } else {
      this.sites.update((prev) =>
        prev.map((s) => {
          if (s.id !== siteId) return s;
          const updated = { ...s, ...data };
          updated.totalExpenses =
            updated.spentWages + updated.spentMaterials + updated.spentRentals + updated.otherExpenses;
          return updated;
        }),
      );
    }
  }

  private calculateWage(
    dailyRate: number,
    status: string,
    overtimeHours: number,
    overtimeAmount?: number,
  ): number {
    if (status === 'Present') return dailyRate;
    if (status === 'Half Day') return dailyRate * 0.5;
    if (status === 'Overtime') {
      const extra =
        overtimeAmount !== undefined && overtimeAmount >= 0
          ? overtimeAmount
          : overtimeHours * (dailyRate / 8);
      return dailyRate + extra;
    }
    return 0; // Absent or Not Marked
  }

  private refreshAllSiteExpenses() {
    if (!this.isBackendOnline() || this.sites().length === 0) return;
    for (const site of this.sites()) {
      this.recalculateSiteExpenses(site.id);
    }
  }

  private recalculateSiteExpenses(siteId: string) {
    const accruedWages = this.attendanceRecords()
      .filter((r) => r.siteId === siteId)
      .reduce((sum, r) => sum + r.wageEarned, 0);

    const paidWages = this.transactions()
      .filter((t) => t.siteId === siteId && t.type === 'Wage Payment')
      .reduce((sum, t) => sum + t.amount, 0);

    const computedWagesExpense = Math.max(accruedWages, paidWages);

    const deliveryTotal = this.deliveries()
      .filter(d => d.siteId === siteId && d.status === 'Delivered')
      .reduce((sum, d) => sum + d.totalAmount, 0);

    const rentalsTotal = this.rentals()
      .filter(r => r.siteId === siteId && r.isActive)
      .reduce((sum, r) => sum + this.calculateRentalCost(r), 0);

    const otherTotal = this.otherExpenseItems()
      .filter(e => e.siteId === siteId && e.isActive)
      .reduce((sum, e) => sum + e.amount, 0);

    this.sites.update(prevSites => {
      return prevSites.map(s => {
        if (s.id === siteId) {
          return {
            ...s,
            spentWages: computedWagesExpense,
            spentMaterials: deliveryTotal,
            spentRentals: rentalsTotal,
            otherExpenses: otherTotal,
            totalExpenses: computedWagesExpense + deliveryTotal + rentalsTotal + otherTotal
          };
        }
        return s;
      });
    });
  }
}
