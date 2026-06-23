import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { hourglass } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-pending-assignment',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div *ngIf="authService.needsSiteAssignment()" class="glass-panel pending-box">
      <ion-icon name="hourglass" color="warning"></ion-icon>
      <div>
        <h3>{{ langService.t('waiting_for_site') }}</h3>
        <p>{{ langService.t('waiting_for_site_desc') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .pending-box {
      margin: 12px 16px;
      padding: 16px;
      border-radius: 14px;
      border-left: 4px solid var(--ion-color-warning);
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    ion-icon { font-size: 28px; flex-shrink: 0; margin-top: 2px; }
    h3 { margin: 0 0 6px; font-size: 15px; font-weight: 700; }
    p { margin: 0; font-size: 13px; color: var(--ion-color-medium); line-height: 1.4; }
  `],
})
export class PendingAssignmentComponent {
  public authService = inject(AuthService);
  public langService = inject(LanguageService);

  constructor() {
    addIcons({ hourglass });
  }
}
