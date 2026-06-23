import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { SettingsModalComponent } from '../components/settings-modal.component';

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
    SettingsModalComponent
  ],
})
export class Tab1Page implements OnInit {
  public dataService = inject(DataService);
  public langService = inject(LanguageService);

  // Modal Visibility Signals
  public showMaterialModal = signal<boolean>(false);
  public showPaymentModal = signal<boolean>(false);
  public showSettingsModal = signal<boolean>(false);
  public showAndroidDownloadBanner = signal<boolean>(false);

  // Form Fields State
  public matFormFlowType: 'Purchase' | 'Rental' = 'Purchase';
  public matFormName = '';
  public matFormSize = '';
  public matFormRatePerDay = 0;
  public matFormStartDate = '2026-06-02';
  public showCustomNameInput = false;
  
  public matFormSupplier = '';
  public matFormQty = 0;
  public matFormUnit = 'Bags';
  public matFormRate = 0;

  public payFormWorkerId = '';
  public payFormAmount = 0;
  public payFormMode: 'Cash' | 'UPI' | 'Bank Transfer' = 'UPI';

  constructor() {
    addIcons({ 
      add, cash, cart, calendar, location, wallet, cube, checkmarkCircle, 
      alertCircle, arrowForward, close, people, statsChart, business, settingsOutline,
      logoAndroid, downloadOutline
    });
  }

  ngOnInit() {
    const isCapacitor = (window as any).Capacitor !== undefined;
    const isDismissed = localStorage.getItem('android_banner_dismissed') === 'true';
    if (!isCapacitor && !isDismissed) {
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
    // Reset form
    this.matFormFlowType = 'Purchase';
    this.matFormName = 'Cement (UltraTech)';
    this.showCustomNameInput = false;
    this.matFormSupplier = '';
    this.matFormQty = 100;
    this.matFormUnit = 'Bags';
    this.matFormRate = 420;
    this.matFormSize = '3*3';
    this.matFormRatePerDay = 10;
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

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }
}
