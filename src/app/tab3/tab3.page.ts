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
  pricetag, business, chevronDown, settingsOutline, trash, checkmarkDone,
  createOutline, refreshCircle
} from 'ionicons/icons';
import { DataService, MaterialInventory, OtherExpense } from '../services/data.service';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';
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
  public authService = inject(AuthService);

  public activeMaterialsSegment = signal<'stock' | 'rentals' | 'other'>('stock');

  public showAddModal = signal<boolean>(false);
  public showOtherExpenseModal = signal<boolean>(false);
  public showEditOtherExpenseModal = signal<boolean>(false);
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

  public otherExpenseName = '';
  public otherExpenseAmount = 0;
  public editingOtherExpenseId = '';
  public editOtherExpenseName = '';
  public editOtherExpenseAmount = 0;

  constructor() {
    addIcons({ 
      cube, add, cart, close, alertCircle, checkmarkCircle, time, 
      pricetag, business, chevronDown, settingsOutline, trash, checkmarkDone,
      createOutline, refreshCircle
    });
  }

  canManage(): boolean {
    return this.authService.isAdmin() || this.authService.isSupervisor();
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

  openOtherExpenseModal() {
    this.otherExpenseName = '';
    this.otherExpenseAmount = 0;
    this.showOtherExpenseModal.set(true);
  }

  closeOtherExpenseModal() {
    this.showOtherExpenseModal.set(false);
  }

  submitOtherExpense() {
    if (!this.otherExpenseName.trim() || this.otherExpenseAmount <= 0) {
      alert(this.langService.t('other_expense_validation'));
      return;
    }
    this.dataService.addOtherExpense(this.otherExpenseName.trim(), this.otherExpenseAmount);
    alert(this.langService.t('other_expense_added'));
    this.closeOtherExpenseModal();
  }

  openEditOtherExpense(item: OtherExpense) {
    this.editingOtherExpenseId = item.id;
    this.editOtherExpenseName = item.name;
    this.editOtherExpenseAmount = item.amount;
    this.showEditOtherExpenseModal.set(true);
  }

  closeEditOtherExpenseModal() {
    this.showEditOtherExpenseModal.set(false);
    this.editingOtherExpenseId = '';
  }

  submitEditOtherExpense() {
    if (!this.editOtherExpenseName.trim() || this.editOtherExpenseAmount <= 0) {
      alert(this.langService.t('other_expense_validation'));
      return;
    }
    this.dataService.updateOtherExpense(this.editingOtherExpenseId, {
      name: this.editOtherExpenseName.trim(),
      amount: this.editOtherExpenseAmount,
    });
    alert(this.langService.t('other_expense_updated'));
    this.closeEditOtherExpenseModal();
  }

  deactivateOtherExpense(itemId: string) {
    if (confirm(this.langService.t('confirm_deactivate_expense'))) {
      this.dataService.setOtherExpenseActive(itemId, false);
    }
  }

  reactivateOtherExpense(itemId: string) {
    this.dataService.setOtherExpenseActive(itemId, true);
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

  deactivateRental(itemId: string) {
    if (confirm(this.langService.t('confirm_deactivate_rental'))) {
      this.dataService.setRentalMaterialActive(itemId, false);
    }
  }

  reactivateRental(itemId: string) {
    this.dataService.setRentalMaterialActive(itemId, true);
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
