import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonButton, IonIcon, IonBadge, IonInput, IonSelect, IonSelectOption, 
  IonButtons, IonModal, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cube, add, cart, close, alertCircle, checkmarkCircle, time, 
  pricetag, business, chevronDown, settingsOutline, trash, checkmarkDone
} from 'ionicons/icons';
import { DataService, MaterialInventory, MaterialDelivery } from '../services/data.service';
import { LanguageService } from '../services/language.service';
import { SettingsModalComponent } from '../components/settings-modal.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonList, IonButton, IonIcon, IonBadge, IonInput, IonSelect, IonSelectOption, 
    IonButtons, IonModal, IonSegment, IonSegmentButton, IonLabel,
    SettingsModalComponent
  ],
})
export class Tab3Page {
  public dataService = inject(DataService);
  public langService = inject(LanguageService);

  // Tab segment view
  public activeMaterialsSegment = signal<'stock' | 'rentals'>('stock');

  // Form Modal State
  public showAddModal = signal<boolean>(false);
  public showSettingsModal = signal<boolean>(false);
  
  public formFlowType: 'Purchase' | 'Rental' = 'Purchase';
  public formMatName = '';
  public formSize = '';
  public formRatePerDay = 0;
  public formStartDate = '';
  public showCustomNameInput = false;

  public formSupplierName = '';
  public formQty = 100;
  public formUnit = 'Bags';
  public formRate = 420;

  constructor() {
    addIcons({ 
      cube, add, cart, close, alertCircle, checkmarkCircle, time, 
      pricetag, business, chevronDown, settingsOutline, trash, checkmarkDone
    });
  }

  onSiteChange(event: any) {
    this.dataService.selectSite(event.detail.value);
  }

  openAddModal() {
    this.formFlowType = 'Purchase';
    this.formMatName = '';
    this.showCustomNameInput = false;
    this.formSupplierName = '';
    this.formQty = 0;
    this.formUnit = 'Bags';
    this.formRate = 0;
    this.formSize = '';
    this.formRatePerDay = 0;
    this.formStartDate = this.dataService.todayString;
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  submitDelivery() {
    if (this.formFlowType === 'Purchase') {
      if (!this.formMatName || !this.formSupplierName || this.formQty <= 0 || this.formRate <= 0) {
        alert('Please fill out all supplier fields correctly.');
        return;
      }
      this.dataService.receiveMaterial(
        this.formMatName,
        this.formSupplierName,
        this.formQty,
        this.formUnit,
        this.formRate
      );
      alert('Material delivery receipt successfully logged. Current stock updated.');
    } else {
      if (!this.formMatName || !this.formSupplierName || this.formQty <= 0 || this.formRatePerDay <= 0) {
        alert('Please fill out all rental fields correctly.');
        return;
      }
      this.dataService.addRentalMaterial(
        this.formMatName,
        this.formSize || 'N/A',
        this.formQty,
        this.formRatePerDay,
        this.formSupplierName,
        this.formStartDate
      );
      alert('Rental equipment record logged. Site rental costs updated.');
    }

    this.closeAddModal();
  }

  returnRental(itemId: string) {
    const returnDate = prompt('Enter Return Date (YYYY-MM-DD):', this.dataService.todayString);
    if (returnDate) {
      this.dataService.returnRentalMaterial(itemId, returnDate);
      alert('Material marked as returned. Final rental cost settled.');
    }
  }

  deleteRental(itemId: string) {
    if (confirm('Are you sure you want to delete this rental record?')) {
      this.dataService.deleteRentalMaterial(itemId);
      alert('Rental record deleted.');
    }
  }

  isLowStock(item: MaterialInventory): boolean {
    return item.stock <= item.lowStockThreshold;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }
}
