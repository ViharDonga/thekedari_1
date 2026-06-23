import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonContent, 
  IonButton, IonIcon, IonSelect, IonSelectOption, 
  IonProgressBar, IonSegment, IonSegmentButton, IonLabel, IonModal,
  IonBadge, IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  business, statsChart, print, cash, cube, wallet, 
  calendar, documentText, barChart, chevronDown, alertCircle, settingsOutline,
  person, checkmarkCircle, time, close
} from 'ionicons/icons';
import { DataService, ConstructionSite } from '../services/data.service';
import { LanguageService } from '../services/language.service';
import { SettingsModalComponent } from '../components/settings-modal.component';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonContent, 
    IonButton, IonIcon, IonSelect, IonSelectOption, 
    IonProgressBar, IonSegment, IonSegmentButton, IonLabel, IonModal,
    IonBadge, IonList,
    SettingsModalComponent
  ],
})
export class Tab4Page {
  public dataService = inject(DataService);
  public langService = inject(LanguageService);

  // Active Report Segment
  public activeSegment = signal<'summary' | 'detail' | 'labour'>('summary');
  
  // Selected site for detailed report
  public selectedSiteId = signal<string>('site-1');

  // Selected worker for detailed labour report
  public selectedWorkerId = signal<string>('');

  // Selected month for detailed labour report
  public selectedMonth = signal<string>('2026-06');
  
  // Settings modal
  public showSettingsModal = signal<boolean>(false);

  constructor() {
    addIcons({ 
      business, statsChart, print, cash, cube, wallet, 
      calendar, documentText, barChart, chevronDown, alertCircle, settingsOutline,
      person, checkmarkCircle, time, close
    });
  }

  // Selected site computed object
  public selectedSite = computed(() => {
    return this.dataService.sites().find(s => s.id === this.selectedSiteId()) || this.dataService.sites()[0];
  });

  // Workers assigned to the selected site
  public selectedSiteWorkers = computed(() => {
    return this.dataService.workers().filter(w => w.siteId === this.selectedSiteId());
  });

  // Selected worker computed object
  public selectedWorker = computed(() => {
    const workers = this.dataService.workers();
    if (workers.length === 0) {
      return {
        id: '',
        name: 'No Labourers',
        role: '',
        dailyRate: 0,
        siteId: '',
        advancePaid: 0,
        balanceDue: 0,
        statusToday: 'Not Marked',
        overtimeHours: 0,
        phone: '',
        avatar: '',
        employmentType: 'Permanent'
      } as any;
    }
    const id = this.selectedWorkerId() || workers[0].id;
    return workers.find(w => w.id === id) || workers[0];
  });

  // Global Multi-Site Stats
  public totalBudget = computed(() => {
    return this.dataService.sites().reduce((sum, s) => sum + s.budget, 0);
  });

  public totalSpent = computed(() => {
    return this.dataService.sites().reduce((sum, s) => sum + s.totalExpenses, 0);
  });

  public totalWages = computed(() => {
    return this.dataService.sites().reduce((sum, s) => sum + s.spentWages, 0);
  });

  public totalMaterials = computed(() => {
    return this.dataService.sites().reduce((sum, s) => sum + s.spentMaterials, 0);
  });

  public totalRentals = computed(() => {
    return this.dataService.sites().reduce((sum, s) => sum + s.spentRentals, 0);
  });

  public totalOther = computed(() => {
    return this.dataService.sites().reduce((sum, s) => sum + s.otherExpenses, 0);
  });

  public totalRemaining = computed(() => {
    return this.totalBudget() - this.totalSpent();
  });

  // Percent Helper for progress bars
  getBudgetUsagePercent(site: ConstructionSite): number {
    if (!site.budget) return 0;
    return site.totalExpenses / site.budget;
  }

  getSpentPercentOfBudget(spent: number, budget: number): number {
    if (!budget) return 0;
    return spent / budget;
  }

  getWagesPercent(site: ConstructionSite): number {
    if (!site.totalExpenses) return 0;
    return site.spentWages / site.totalExpenses;
  }

  getMaterialsPercent(site: ConstructionSite): number {
    if (!site.totalExpenses) return 0;
    return site.spentMaterials / site.totalExpenses;
  }

  getRentalsPercent(site: ConstructionSite): number {
    if (!site.totalExpenses) return 0;
    return site.spentRentals / site.totalExpenses;
  }

  getOthersPercent(site: ConstructionSite): number {
    if (!site.totalExpenses) return 0;
    return site.otherExpenses / site.totalExpenses;
  }

  getWorkerMonthlyAttendanceStats(workerId: string) {
    const prefix = this.selectedMonth();
    const records = this.dataService.attendanceRecords().filter(r => r.workerId === workerId && r.date.startsWith(prefix));
    
    let present = 0;
    let halfDay = 0;
    let absent = 0;
    let overtime = 0;
    let totalWages = 0;

    records.forEach(r => {
      totalWages += r.wageEarned;
      if (r.status === 'Present') present++;
      else if (r.status === 'Half Day') halfDay++;
      else if (r.status === 'Absent') absent++;
      else if (r.status === 'Overtime') overtime++;
    });

    return {
      present,
      halfDay,
      absent,
      overtime,
      totalWages
    };
  }

  viewSiteDetails(siteId: string) {
    this.selectedSiteId.set(siteId);
    this.activeSegment.set('detail');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  getWorkerTotalPaidWages(workerId: string): number {
    return this.dataService.transactions()
      .filter(t => t.workerId === workerId && t.type === 'Wage Payment')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getWorkerTransactions(workerId: string) {
    return this.dataService.transactions().filter(t => t.workerId === workerId);
  }

  getMonthDays(): number[] {
    const [yearStr, monthStr] = this.selectedMonth().split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const daysCount = new Date(year, month, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  getCurrentDay(): number {
    const currentSimulatedMonth = this.dataService.todayString.substring(0, 7); // '2026-06'
    if (this.selectedMonth() === currentSimulatedMonth) {
      return parseInt(this.dataService.todayString.split('-')[2], 10);
    }
    return -1;
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
    const dateStr = `${this.selectedMonth()}-${day.toString().padStart(2, '0')}`;
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

  getSelectedMonthLabel(): string {
    const [year, month] = this.selectedMonth().split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  getSelectedMonthShortName(): string {
    const [year, month] = this.selectedMonth().split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
  }

  printReport() {
    window.print();
  }
}
