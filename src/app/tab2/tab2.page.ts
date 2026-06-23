import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
  IonAvatar, IonBadge, IonButton, IonIcon, IonSearchbar, 
  IonModal, IonInput, IonSelect, IonSelectOption, IonButtons,
  IonSegment, IonSegmentButton, IonLabel, IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  search, funnel, call, wallet, calendar, cash, close, 
  checkmarkCircle, time, person, alertCircle, logoWhatsapp, settingsOutline, add,
  people, trash, personAdd
} from 'ionicons/icons';
import { DataService, Worker, Transaction } from '../services/data.service';
import { LanguageService } from '../services/language.service';
import { SettingsModalComponent } from '../components/settings-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
    IonAvatar, IonBadge, IonButton, IonIcon, IonSearchbar, 
    IonModal, IonInput, IonSelect, IonSelectOption, IonButtons,
    IonSegment, IonSegmentButton, IonLabel, IonFab, IonFabButton,
    SettingsModalComponent
  ],
})
export class Tab2Page {
  public dataService = inject(DataService);
  public langService = inject(LanguageService);

  // Active Sub-Tab Segment
  public activeLabourTab = signal<'roster' | 'bookings' | 'payouts_ledger'>('roster');

  // Filter Search State
  public searchQuery = signal<string>('');
  public selectedRoleFilter = signal<string>('All');
  public selectedSiteFilter = signal<string>('All');

  // Detail Modal State
  public selectedWorker = signal<Worker | null>(null);
  public showDetailModal = signal<boolean>(false);
  public paymentAmount = signal<number>(0);
  public paymentMode = signal<'Cash' | 'UPI' | 'Bank Transfer'>('UPI');
  public showSettingsModal = signal<boolean>(false);

  // Overtime Custom Drawer State
  public showOtModal = signal<boolean>(false);
  public otWorker = signal<Worker | null>(null);
  public otHours = signal<number>(2);

  // Selected Date state
  public selectedDate = signal<string>('');

  // Advance Bookings Form State
  public showBookingModal = signal<boolean>(false);
  public bookingWorkerId = '';
  public bookingSiteId = '';
  public bookingDate = '2026-06-05';
  public bookingRate = 500;
  public bookingRemarks = '';

  // Add Worker Form State
  public showAddWorkerModal = signal<boolean>(false);
  public newWorkerName = '';
  public newWorkerRole: Worker['role'] = 'Labour';
  public newWorkerRate = 500;
  public newWorkerSiteId = '';
  public newWorkerPhone = '';
  public newWorkerType: 'Permanent' | 'Casual' = 'Permanent';

  // Filtered advance payments daybook
  public advanceTransactions = computed(() => {
    return this.dataService.transactions().filter(t => t.type === 'Advance Payment');
  });

  constructor() {
    this.selectedDate.set(this.dataService.todayString);
    addIcons({ 
      search, funnel, call, wallet, calendar, cash, close, 
      checkmarkCircle, time, person, alertCircle, logoWhatsapp, settingsOutline, add,
      people, trash, personAdd
    });
  }

  // Filtered Workers List
  public filteredWorkers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const role = this.selectedRoleFilter();
    const site = this.selectedSiteFilter();
    
    return this.dataService.workers().filter(w => {
      // Search text query
      const matchesSearch = w.name.toLowerCase().includes(query) || w.role.toLowerCase().includes(query);
      
      // Role filter
      const matchesRole = role === 'All' || w.role === role;
      
      // Site filter
      const matchesSite = site === 'All' || w.siteId === site;

      return matchesSearch && matchesRole && matchesSite;
    });
  });

  public presentCount = computed(() => {
    return this.filteredWorkers().filter(w => {
      const status = this.getWorkerStatusForSelectedDate(w);
      return status === 'Present' || status === 'Overtime' || status === 'Half Day';
    }).length;
  });

  public absentCount = computed(() => {
    return this.filteredWorkers().filter(w => {
      const status = this.getWorkerStatusForSelectedDate(w);
      return status === 'Absent';
    }).length;
  });

  getWorkerStatusForSelectedDate(worker: Worker): 'Present' | 'Absent' | 'Half Day' | 'Overtime' | 'Not Marked' | 'Not Called' {
    const date = this.selectedDate();
    if (date === this.dataService.todayString) {
      return worker.statusToday;
    }
    const record = this.dataService.attendanceRecords().find(r => r.workerId === worker.id && r.date === date);
    if (record) {
      return record.status as any;
    }
    return worker.employmentType === 'Permanent' ? 'Not Marked' : 'Not Called';
  }

  getWorkerOvertimeHoursForSelectedDate(worker: Worker): number {
    const date = this.selectedDate();
    if (date === this.dataService.todayString) {
      return worker.overtimeHours;
    }
    const record = this.dataService.attendanceRecords().find(r => r.workerId === worker.id && r.date === date);
    return record ? record.overtimeHours : 0;
  }

  onDateChange(event: any) {
    if (event.detail.value) {
      const val = event.detail.value.split('T')[0];
      this.selectedDate.set(val);
    }
  }

  // Actions
  onSearchChange(event: any) {
    this.searchQuery.set(event.detail.value || '');
  }

  onRoleFilterChange(event: any) {
    this.selectedRoleFilter.set(event.detail.value);
  }

  onSiteFilterChange(event: any) {
    this.selectedSiteFilter.set(event.detail.value);
  }

  setAttendance(worker: Worker, status: 'Present' | 'Absent' | 'Half Day' | 'Overtime' | 'Not Marked') {
    const date = this.selectedDate();
    if (status === 'Overtime') {
      this.otWorker.set(worker);
      this.otHours.set(2); // default
      this.showOtModal.set(true);
    } else {
      this.dataService.updateWorkerAttendance(worker.id, status, 0, date);
    }
  }

  submitOt() {
    if (this.otWorker()) {
      const date = this.selectedDate();
      this.dataService.updateWorkerAttendance(this.otWorker()!.id, 'Overtime', this.otHours(), date);
      this.showOtModal.set(false);
      this.otWorker.set(null);
    }
  }

  closeOtModal() {
    this.showOtModal.set(false);
    this.otWorker.set(null);
  }

  viewWorkerDetails(worker: Worker) {
    this.selectedWorker.set(worker);
    this.paymentAmount.set(0);
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.selectedWorker.set(null);
  }

  submitDetailPayment() {
    const worker = this.selectedWorker();
    const amt = this.paymentAmount();
    if (!worker || amt <= 0) return;

    this.dataService.payWorker(worker.id, amt, this.paymentMode(), 'Wage Payment');
    
    // Refresh local selectedWorker reference to show updated balance
    const updated = this.dataService.workers().find(w => w.id === worker.id);
    if (updated) {
      this.selectedWorker.set(updated);
    }
    
    this.paymentAmount.set(0);
    alert(`Payment of ₹${amt} successfully logged for ${worker.name}.`);
  }

  getWorkerTransactions(workerId: string): Transaction[] {
    return this.dataService.transactions().filter(t => t.workerId === workerId);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  getSiteName(siteId: string): string {
    const s = this.dataService.sites().find(site => site.id === siteId);
    return s ? s.name : 'Unknown';
  }

  // Monthly calendar helpers
  getMonthDays(): number[] {
    return Array.from({ length: 30 }, (_, i) => i + 1);
  }

  getCurrentDay(): number {
    return parseInt(this.dataService.todayString.split('-')[2], 10);
  }

  getAttendanceStatusShort(workerId: string, day: number): string {
    const status = this.getAttendanceStatusForDay(workerId, day);
    if (status === 'Present') return 'P';
    if (status === 'Absent') return 'A';
    if (status === 'Half Day') return 'HD';
    if (status === 'Overtime') return 'OT';
    return '';
  }

  getAttendanceStatusForDay(workerId: string, day: number): string {
    const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
    const record = this.dataService.attendanceRecords().find(r => r.workerId === workerId && r.date === dateStr);
    return record ? record.status : 'None';
  }

  getAttendanceBgColor(workerId: string, day: number): string {
    const status = this.getAttendanceStatusForDay(workerId, day);
    if (status === 'Present') return 'rgba(48, 209, 88, 0.15)';
    if (status === 'Absent') return 'rgba(255, 69, 58, 0.15)';
    if (status === 'Half Day') return 'rgba(255, 214, 10, 0.15)';
    if (status === 'Overtime') return 'rgba(100, 210, 255, 0.15)';
    return 'rgba(255, 255, 255, 0.02)';
  }

  getAttendanceTextColor(workerId: string, day: number): string {
    const status = this.getAttendanceStatusForDay(workerId, day);
    if (status === 'Present') return '#30d158';
    if (status === 'Absent') return '#ff453a';
    if (status === 'Half Day') return '#ffd60a';
    if (status === 'Overtime') return '#64d2ff';
    return 'var(--ion-color-medium)';
  }

  // Advance Bookings actions
  openBookingModal() {
    const workers = this.dataService.workers();
    const sites = this.dataService.sites();
    this.bookingWorkerId = workers.length > 0 ? workers[0].id : '';
    this.bookingSiteId = sites.length > 0 ? sites[0].id : '';
    this.bookingDate = '2026-06-10'; // Simulated future booking date
    this.bookingRate = workers.length > 0 ? workers[0].dailyRate : 500;
    this.bookingRemarks = '';
    this.showBookingModal.set(true);
  }

  onBookingWorkerChange(event: any) {
    const worker = this.dataService.workers().find(w => w.id === event.detail.value);
    if (worker) {
      this.bookingRate = worker.dailyRate;
    }
  }

  submitBooking() {
    if (!this.bookingWorkerId || !this.bookingSiteId || !this.bookingDate || this.bookingRate <= 0) {
      alert('Please fill out all booking fields correctly.');
      return;
    }
    this.dataService.addLabourBooking(
      this.bookingWorkerId,
      this.bookingSiteId,
      this.bookingDate,
      this.bookingRate,
      this.bookingRemarks
    );
    this.showBookingModal.set(false);
    alert('Labour booked successfully in Advance Booking Book.');
  }

  cancelBooking(bookingId: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.dataService.cancelLabourBooking(bookingId);
      alert('Booking cancelled.');
    }
  }

  deleteAdvanceTransaction(txId: string) {
    if (confirm('Are you sure you want to delete this payment transaction?')) {
      const tx = this.dataService.transactions().find(t => t.id === txId);
      if (tx) {
        const workerId = tx.workerId;
        this.dataService.workers.update(prevWorkers => {
          return prevWorkers.map(w => {
            if (w.id === workerId) {
              return {
                ...w,
                advancePaid: Math.max(0, w.advancePaid - tx.amount)
              };
            }
            return w;
          });
        });
        this.dataService.transactions.update(prev => prev.filter(t => t.id !== txId));
        alert('Advance payment entry deleted.');
      }
    }
  }

  openAddWorkerModal() {
    const sites = this.dataService.sites();
    this.newWorkerName = '';
    this.newWorkerRole = 'Labour';
    this.newWorkerRate = 500;
    this.newWorkerSiteId = sites.length > 0 ? sites[0].id : '';
    this.newWorkerPhone = '';
    this.newWorkerType = 'Permanent';
    this.showAddWorkerModal.set(true);
  }

  submitAddWorker() {
    if (!this.newWorkerName.trim() || !this.newWorkerPhone.trim() || this.newWorkerRate <= 0 || !this.newWorkerSiteId) {
      alert('Please fill out all worker fields correctly.');
      return;
    }
    this.dataService.addWorker(
      this.newWorkerName,
      this.newWorkerRole,
      this.newWorkerRate,
      this.newWorkerSiteId,
      this.newWorkerPhone,
      this.newWorkerType
    );
    this.showAddWorkerModal.set(false);
    alert(this.langService.t('worker_added_success'));
  }

  callWorker(worker: Worker) {
    const date = this.selectedDate();
    this.dataService.updateWorkerAttendance(worker.id, 'Not Marked', 0, date);
  }

  releaseWorker(worker: Worker) {
    const date = this.selectedDate();
    if (confirm('Cancel call and release worker? This will reset the attendance status.')) {
      this.dataService.updateWorkerAttendance(worker.id, 'Not Called', 0, date);
    }
  }
}
