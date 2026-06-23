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
  people, trash, personAdd, chevronBack, chevronForward
} from 'ionicons/icons';
import { DataService, Worker, Transaction, AttendanceRecord } from '../services/data.service';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';
import { SettingsModalComponent } from '../components/settings-modal.component';
import { PendingAssignmentComponent } from '../components/pending-assignment.component';
import { WorkerAvatarComponent } from '../components/worker-avatar.component';

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
    SettingsModalComponent,
    PendingAssignmentComponent,
    WorkerAvatarComponent
  ],
})
export class Tab2Page {
  public dataService = inject(DataService);
  public langService = inject(LanguageService);
  public authService = inject(AuthService);

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
  public editDailyRate = 0;
  public showSettingsModal = signal<boolean>(false);

  // Overtime modal state (plain numbers — signals break ngModel)
  public showOtModal = signal<boolean>(false);
  public otWorker = signal<Worker | null>(null);
  public otEditDate = '';
  public otHoursNum = 2;
  public otAmountNum = 0;

  // Edit attendance for a calendar day in worker detail
  public showDayEditModal = signal<boolean>(false);
  public dayEditDate = '';
  public dayEditStatus: 'Present' | 'Absent' | 'Half Day' | 'Overtime' = 'Present';
  public dayEditWage = 0;
  public dayEditPayment = 0;
  public dayEditPaymentMode: 'Cash' | 'UPI' | 'Bank Transfer' = 'Cash';
  public dayEditOtHours = 0;

  // Selected Date state
  public selectedDate = signal<string>('');

  // Advance Bookings Form State
  public showBookingModal = signal<boolean>(false);
  public bookingWorkerId = '';
  public bookingSiteId = '';
  public bookingDate = '';
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

  // Current month for attendance grid (YYYY-MM)
  public attendanceMonth = signal<string>('');

  constructor() {
    this.selectedDate.set(this.dataService.todayString);
    this.attendanceMonth.set(this.dataService.todayString.substring(0, 7));
    addIcons({ 
      search, funnel, call, wallet, calendar, cash, close, 
      checkmarkCircle, time, person, alertCircle, logoWhatsapp, settingsOutline, add,
      people, trash, personAdd, chevronBack, chevronForward
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

  getAttendanceRecord(workerId: string, date: string): AttendanceRecord | undefined {
    return this.dataService.attendanceRecords().find((r) => r.workerId === workerId && r.date === date);
  }

  getWorkerOvertimeAmountForDate(worker: Worker, date: string): number {
    const record = this.getAttendanceRecord(worker.id, date);
    if (record?.status === 'Overtime') {
      return Math.max(0, Math.round(record.wageEarned - worker.dailyRate));
    }
    if (date === this.dataService.todayString && worker.statusToday === 'Overtime') {
      const rec = this.getAttendanceRecord(worker.id, date);
      if (rec) {
        return Math.max(0, Math.round(rec.wageEarned - worker.dailyRate));
      }
      return Math.round(worker.overtimeHours * (worker.dailyRate / 8));
    }
    return 0;
  }

  getWorkerWageForDate(worker: Worker, date: string): number {
    const record = this.getAttendanceRecord(worker.id, date);
    if (record) {
      return record.wageEarned;
    }
    if (date === this.dataService.todayString) {
      const status = worker.statusToday;
      if (status === 'Present') return worker.dailyRate;
      if (status === 'Half Day') return worker.dailyRate * 0.5;
      if (status === 'Overtime') {
        return worker.dailyRate + this.getWorkerOvertimeAmountForDate(worker, date);
      }
    }
    return 0;
  }

  getWorkerOvertimeHoursForSelectedDate(worker: Worker): number {
    const date = this.selectedDate();
    if (date === this.dataService.todayString) {
      return worker.overtimeHours;
    }
    const record = this.getAttendanceRecord(worker.id, date);
    return record ? record.overtimeHours : 0;
  }

  getWorkerOvertimeAmountForSelectedDate(worker: Worker): number {
    return this.getWorkerOvertimeAmountForDate(worker, this.selectedDate());
  }

  isSelectedDateToday(): boolean {
    return this.selectedDate() === this.dataService.todayString;
  }

  attendanceMarkLabel(): string {
    return this.isSelectedDateToday()
      ? this.langService.t('today_mark')
      : `${this.langService.t('attendance_mark')}: ${this.selectedDate()}`;
  }

  calcOtAmountFromHours(worker: Worker, hours: number): number {
    return Math.round(hours * (worker.dailyRate / 8));
  }

  calcOtTotalDayPay(worker: Worker): number {
    return worker.dailyRate + (this.otAmountNum || 0);
  }

  onOtHoursChange() {
    const worker = this.otWorker();
    if (worker) {
      this.otAmountNum = this.calcOtAmountFromHours(worker, this.otHoursNum);
    }
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
      this.openOtModal(worker, date);
    } else {
      this.dataService.updateWorkerAttendance(worker.id, status, 0, date);
    }
  }

  openOtModal(worker: Worker, date: string) {
    const existingHours = this.getWorkerOvertimeHoursForDate(worker, date);
    const existingAmount = this.getWorkerOvertimeAmountForDate(worker, date);
    this.otWorker.set(worker);
    this.otEditDate = date;
    this.otHoursNum = existingHours > 0 ? existingHours : 2;
    this.otAmountNum =
      existingAmount > 0 ? existingAmount : this.calcOtAmountFromHours(worker, this.otHoursNum);
    this.showOtModal.set(true);
  }

  getWorkerOvertimeHoursForDate(worker: Worker, date: string): number {
    if (date === this.dataService.todayString) {
      return worker.overtimeHours;
    }
    const record = this.getAttendanceRecord(worker.id, date);
    return record ? record.overtimeHours : 0;
  }

  submitOt() {
    const worker = this.otWorker();
    if (!worker) return;
    if (this.otAmountNum < 0) {
      alert('Enter a valid OT amount.');
      return;
    }
    const totalDayWage = this.calcOtTotalDayPay(worker);
    this.dataService.updateWorkerAttendance(
      worker.id,
      'Overtime',
      this.otHoursNum,
      this.otEditDate,
      this.otAmountNum,
      totalDayWage,
    );
    const updated = this.dataService.workers().find((w) => w.id === worker.id);
    if (updated && this.selectedWorker()?.id === worker.id) {
      this.selectedWorker.set(updated);
    }
    this.showOtModal.set(false);
    this.otWorker.set(null);
  }

  closeOtModal() {
    this.showOtModal.set(false);
    this.otWorker.set(null);
  }

  // Monthly calendar
  changeAttendanceMonth(delta: number) {
    const [y, m] = this.attendanceMonth().split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    this.attendanceMonth.set(month);
  }

  attendanceMonthLabel(): string {
    const [y, m] = this.attendanceMonth().split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  openDayEdit(day: number) {
    const worker = this.selectedWorker();
    if (!worker || !this.canManageWages()) return;
    this.dayEditDate = `${this.attendanceMonth()}-${String(day).padStart(2, '0')}`;
    const record = this.getAttendanceRecord(worker.id, this.dayEditDate);
    if (record) {
      this.dayEditStatus = record.status as 'Present' | 'Absent' | 'Half Day' | 'Overtime';
      this.dayEditWage = record.wageEarned;
      this.dayEditOtHours = record.overtimeHours;
    } else {
      this.dayEditStatus = 'Present';
      this.dayEditWage = worker.dailyRate;
      this.dayEditOtHours = 0;
    }
    this.dayEditPayment = this.getDayPaymentTotal(worker.id, this.dayEditDate);
    this.dayEditPaymentMode = 'Cash';
    this.showDayEditModal.set(true);
  }

  closeDayEditModal() {
    this.showDayEditModal.set(false);
    this.dayEditDate = '';
  }

  getDayPaymentTotal(workerId: string, date: string): number {
    return this.dataService
      .transactions()
      .filter((t) => t.workerId === workerId && t.date === date && t.type === 'Wage Payment')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  selectDayStatus(status: 'Present' | 'Absent' | 'Half Day' | 'Overtime') {
    const worker = this.selectedWorker();
    if (!worker) return;
    if (status === 'Overtime') {
      this.closeDayEditModal();
      this.openOtModal(worker, this.dayEditDate);
      return;
    }
    this.dayEditStatus = status;
    if (status === 'Present') {
      this.dayEditWage = worker.dailyRate;
    } else if (status === 'Half Day') {
      this.dayEditWage = Math.round(worker.dailyRate / 2);
    } else if (status === 'Absent') {
      this.dayEditWage = 0;
    }
  }

  saveDayEdit() {
    const worker = this.selectedWorker();
    if (!worker || !this.dayEditDate) return;

    if (this.dayEditStatus === 'Absent' && this.dayEditWage <= 0) {
      this.dataService.updateWorkerAttendance(worker.id, 'Absent', 0, this.dayEditDate, undefined, 0);
    } else if (this.dayEditWage < 0) {
      alert('Enter a valid day wage amount.');
      return;
    } else {
      const otExtra =
        this.dayEditStatus === 'Overtime'
          ? Math.max(0, this.dayEditWage - worker.dailyRate)
          : undefined;
      this.dataService.updateWorkerAttendance(
        worker.id,
        this.dayEditStatus,
        this.dayEditOtHours,
        this.dayEditDate,
        otExtra,
        this.dayEditWage,
      );
    }

    const existingPaid = this.getDayPaymentTotal(worker.id, this.dayEditDate);
    const newPayment = this.dayEditPayment;
    if (newPayment > 0 && newPayment !== existingPaid) {
      const delta = newPayment - existingPaid;
      if (delta > 0) {
        this.dataService.payWorker(worker.id, delta, this.dayEditPaymentMode, 'Wage Payment', this.dayEditDate);
      }
    }

    this.closeDayEditModal();
    alert(this.langService.t('save_day_edit') + ' ✓');
  }

  getDayEditStatus(): string {
    const worker = this.selectedWorker();
    if (!worker || !this.dayEditDate) return 'None';
    const record = this.getAttendanceRecord(worker.id, this.dayEditDate);
    return record ? record.status : 'None';
  }

  getDayEditWage(): number {
    const worker = this.selectedWorker();
    if (!worker || !this.dayEditDate) return 0;
    return this.getWorkerWageForDate(worker, this.dayEditDate);
  }

  getDayOvertimeAmount(workerId: string, day: number): number {
    const worker = this.selectedWorker();
    if (!worker) return 0;
    const dateStr = `${this.attendanceMonth()}-${String(day).padStart(2, '0')}`;
    return this.getWorkerOvertimeAmountForDate(worker, dateStr);
  }

  viewWorkerDetails(worker: Worker) {
    this.selectedWorker.set(worker);
    this.editDailyRate = worker.dailyRate;
    this.paymentAmount.set(0);
    this.attendanceMonth.set(this.selectedDate().substring(0, 7));
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.selectedWorker.set(null);
  }

  saveDailyRate() {
    const worker = this.selectedWorker();
    if (!worker || this.editDailyRate <= 0) {
      alert('Enter a valid daily wage.');
      return;
    }
    if (this.editDailyRate === worker.dailyRate) {
      return;
    }
    if (!confirm(`Change daily wage from ₹${worker.dailyRate} to ₹${this.editDailyRate}? Past attendance will be recalculated.`)) {
      return;
    }
    this.dataService.updateWorker(worker.id, { dailyRate: this.editDailyRate });
    this.selectedWorker.set({ ...worker, dailyRate: this.editDailyRate });
    alert(this.langService.t('wage_updated'));
  }

  canManageWages(): boolean {
    return this.authService.isAdmin() || this.authService.isSupervisor();
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
    const [yearStr, monthStr] = this.attendanceMonth().split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const daysCount = new Date(year, month, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  getCurrentDay(): number {
    const currentMonth = this.dataService.todayString.substring(0, 7);
    if (this.attendanceMonth() === currentMonth) {
      return parseInt(this.dataService.todayString.split('-')[2], 10);
    }
    return -1;
  }

  getAttendanceStatusShort(workerId: string, day: number): string {
    const status = this.getAttendanceStatusForDay(workerId, day);
    if (status === 'Present') return 'P';
    if (status === 'Absent') return 'A';
    if (status === 'Half Day') return 'HD';
    if (status === 'Overtime') {
      const amt = this.getDayOvertimeAmount(workerId, day);
      return amt > 0 ? `+₹${amt}` : 'OT';
    }
    return '';
  }

  getAttendanceStatusForDay(workerId: string, day: number): string {
    const dateStr = `${this.attendanceMonth()}-${day.toString().padStart(2, '0')}`;
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
    this.bookingDate = this.dataService.todayString;
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
