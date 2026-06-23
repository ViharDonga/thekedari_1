import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonButton, IonIcon, IonSelect, IonSelectOption, IonProgressBar, 
  IonModal, IonInput, IonBadge, IonButtons, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  add, cash, cart, calendar, location, wallet, cube, checkmarkCircle, 
  alertCircle, arrowForward, close, people, statsChart, business, settingsOutline,
  logoAndroid, downloadOutline
} from 'ionicons/icons';
import { DataService, ConstructionSite, Worker } from '../services/data.service';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';
import { SettingsModalComponent } from '../components/settings-modal.component';
import { PendingAssignmentComponent } from '../components/pending-assignment.component';
import { AuthUser } from '../services/auth.service';
import { getApkDownloadUrl } from '../utils/apk-url';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonList, IonButton, IonIcon, IonSelect, IonSelectOption, IonProgressBar, 
    IonModal, IonInput, IonBadge, IonButtons, IonSegment, IonSegmentButton, IonLabel,
    SettingsModalComponent,
    PendingAssignmentComponent
  ],
})
export class Tab1Page implements OnInit {
  public dataService = inject(DataService);
  public langService = inject(LanguageService);
  public authService = inject(AuthService);

  // Modal Visibility Signals
  public showMaterialModal = signal<boolean>(false);
  public showPaymentModal = signal<boolean>(false);
  public showSettingsModal = signal<boolean>(false);
  public showAddSiteModal = signal<boolean>(false);
  public showEditSiteModal = signal<boolean>(false);
  public showAssignUserModal = signal<boolean>(false);
  public showAndroidDownloadBanner = signal<boolean>(false);

  public pendingUsers = signal<AuthUser[]>([]);
  public assignUserId = '';
  public assignSiteId = '';
  public assignWorkerId = '';

  // Add Site Form
  public siteFormName = '';
  public siteFormLocation = '';
  public siteFormBudget = 0;
  public siteFormSupervisor = '';
  public siteFormOtherExpenses = 0;

  // Form Fields State
  public matFormFlowType: 'Purchase' | 'Rental' = 'Purchase';
  public matFormName = '';
  public matFormSize = '';
  public matFormRatePerDay = 0;
  public matFormStartDate = '';
  public showCustomNameInput = false;
  
  public matFormSupplier = '';
  public matFormQty = 0;
  public matFormUnit = 'Bags';
  public matFormRate = 0;

  public payFormWorkerId = '';
  public payFormAmount = 0;
  public payFormMode: 'Cash' | 'UPI' | 'Bank Transfer' = 'UPI';
  public apkDownloadUrl = getApkDownloadUrl();

  constructor() {
    addIcons({ 
      add, cash, cart, calendar, location, wallet, cube, checkmarkCircle, 
      alertCircle, arrowForward, close, people, statsChart, business, settingsOutline,
      logoAndroid, downloadOutline
    });
  }

  ngOnInit() {
    const isDismissed = localStorage.getItem('android_banner_dismissed') === 'true';
    if (!Capacitor.isNativePlatform() && !isDismissed) {
      this.showAndroidDownloadBanner.set(true);
    }
  }

  dismissAndroidBanner() {
    this.showAndroidDownloadBanner.set(false);
    localStorage.setItem('android_banner_dismissed', 'true');
  }

  // Event Handlers
  onSiteChange(event: any) {
    this.dataService.selectSite(event.detail.value);
  }

  openMaterialModal() {
    this.matFormFlowType = 'Purchase';
    this.matFormName = '';
    this.showCustomNameInput = false;
    this.matFormSupplier = '';
    this.matFormQty = 0;
    this.matFormUnit = 'Bags';
    this.matFormRate = 0;
    this.matFormSize = '';
    this.matFormRatePerDay = 0;
    this.matFormStartDate = this.dataService.todayString;
    this.showMaterialModal.set(true);
  }

  closeMaterialModal() {
    this.showMaterialModal.set(false);
  }

  submitMaterialDelivery() {
    if (this.matFormFlowType === 'Purchase') {
      if (!this.matFormName || !this.matFormSupplier || this.matFormQty <= 0 || this.matFormRate <= 0) {
        alert('Please fill out all fields correctly.');
        return;
      }
      this.dataService.receiveMaterial(
        this.matFormName,
        this.matFormSupplier,
        this.matFormQty,
        this.matFormUnit,
        this.matFormRate
      );
    } else {
      if (!this.matFormName || !this.matFormSupplier || this.matFormQty <= 0 || this.matFormRatePerDay <= 0) {
        alert('Please fill out all rental fields correctly.');
        return;
      }
      this.dataService.addRentalMaterial(
        this.matFormName,
        this.matFormSize || 'N/A',
        this.matFormQty,
        this.matFormRatePerDay,
        this.matFormSupplier,
        this.matFormStartDate
      );
    }

    this.closeMaterialModal();
  }

  openPaymentModal() {
    // Reset form
    const workers = this.dataService.activeSiteWorkers();
    this.payFormWorkerId = workers.length > 0 ? workers[0].id : '';
    this.payFormAmount = 0;
    this.payFormMode = 'UPI';
    this.showPaymentModal.set(true);
  }

  closePaymentModal() {
    this.showPaymentModal.set(false);
  }

  openAddSiteModal() {
    this.siteFormName = '';
    this.siteFormLocation = '';
    this.siteFormBudget = 0;
    this.siteFormSupervisor = '';
    this.showAddSiteModal.set(true);
  }

  closeAddSiteModal() {
    this.showAddSiteModal.set(false);
  }

  openEditSiteModal() {
    const site = this.dataService.activeSite();
    this.siteFormName = site.name;
    this.siteFormLocation = site.location;
    this.siteFormBudget = site.budget;
    this.siteFormSupervisor = site.supervisorName;
    this.siteFormOtherExpenses = site.otherExpenses;
    this.showEditSiteModal.set(true);
  }

  closeEditSiteModal() {
    this.showEditSiteModal.set(false);
  }

  submitEditSite() {
    const site = this.dataService.activeSite();
    if (!this.siteFormName || !this.siteFormLocation || this.siteFormBudget <= 0 || !this.siteFormSupervisor) {
      alert(this.langService.t('add_site_validation'));
      return;
    }
    this.dataService.updateSite(site.id, {
      name: this.siteFormName,
      location: this.siteFormLocation,
      budget: this.siteFormBudget,
      supervisorName: this.siteFormSupervisor,
      otherExpenses: this.siteFormOtherExpenses,
    });
    this.closeEditSiteModal();
    alert(this.langService.t('site_updated'));
  }

  canEditSite(): boolean {
    return this.authService.isAdmin() || this.authService.isSupervisor();
  }

  submitAddSite() {
    if (!this.siteFormName || !this.siteFormLocation || this.siteFormBudget <= 0 || !this.siteFormSupervisor) {
      alert(this.langService.t('add_site_validation'));
      return;
    }

    this.dataService.addSite(
      this.siteFormName,
      this.siteFormLocation,
      this.siteFormBudget,
      this.siteFormSupervisor,
    );
    this.closeAddSiteModal();
  }

  openAssignUserModal() {
    this.assignUserId = '';
    this.assignSiteId = this.dataService.sites()[0]?.id || '';
    this.assignWorkerId = '';
    this.authService.listUsers().subscribe({
      next: (users) => {
        this.pendingUsers.set(users.filter((u) => u.role !== 'ADMIN' && !u.siteId));
        this.showAssignUserModal.set(true);
      },
    });
  }

  closeAssignUserModal() {
    this.showAssignUserModal.set(false);
  }

  onAssignUserChange() {
    this.assignWorkerId = '';
    const user = this.pendingUsers().find((u) => u.id === this.assignUserId);
    if (user?.role === 'LABOUR' && this.assignSiteId) {
      const workers = this.dataService.workers().filter((w) => w.siteId === this.assignSiteId);
      this.assignWorkerId = workers[0]?.id || '';
    }
  }

  submitAssignUser() {
    if (!this.assignUserId || !this.assignSiteId) {
      alert(this.langService.t('signup_validation'));
      return;
    }
    const user = this.pendingUsers().find((u) => u.id === this.assignUserId);
    const workerId = user?.role === 'LABOUR' ? this.assignWorkerId : undefined;
    if (user?.role === 'LABOUR' && !workerId) {
      alert(this.langService.t('select_worker_required'));
      return;
    }

    this.authService.assignUserSite(this.assignUserId, this.assignSiteId, workerId).subscribe({
      next: () => {
        alert(this.langService.t('assign_site_success'));
        this.closeAssignUserModal();
      },
      error: (err) => alert(err.error?.message || 'Failed to assign user'),
    });
  }

  submitPayment() {
    if (!this.payFormWorkerId || this.payFormAmount <= 0) {
      alert('Please select a worker and specify an amount.');
      return;
    }

    this.dataService.payWorker(
      this.payFormWorkerId,
      this.payFormAmount,
      this.payFormMode,
      'Wage Payment'
    );

    this.closePaymentModal();
  }

  // Helpers for UI templates
  getBudgetUsagePercent(site: ConstructionSite): number {
    if (!site.budget) return 0;
    return site.totalExpenses / site.budget;
  }

  getWagesPercent(site: ConstructionSite): number {
    if (!site.totalExpenses) return 0;
    return site.spentWages / site.totalExpenses;
  }

  getMaterialsPercent(site: ConstructionSite): number {
    if (!site.totalExpenses) return 0;
    return site.spentMaterials / site.totalExpenses;
  }

  getOthersPercent(site: ConstructionSite): number {
    if (!site.totalExpenses) return 0;
    return site.otherExpenses / site.totalExpenses;
  }

  selectedAssignUser() {
    return this.pendingUsers().find((u) => u.id === this.assignUserId);
  }

  assignSiteWorkers() {
    return this.dataService.workers().filter((w) => w.siteId === this.assignSiteId);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }
}
