import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, downloadOutline, refreshCircle } from 'ionicons/icons';
import { AppUpdateService } from '../services/app-update.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-update-banner',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon],
  template: `
    <div
      *ngIf="updateService.updateAvailable()"
      class="update-banner glass-panel"
      style="margin: 0; border-radius: 0; border-left: none; border-right: none; border-top: none; padding: 12px 16px; padding-top: calc(12px + env(safe-area-inset-top)); position: relative; z-index: 9999; border-bottom: 1px solid rgba(255,159,10,0.35);"
    >
      <button
        type="button"
        (click)="dismiss()"
        style="position: absolute; top: calc(10px + env(safe-area-inset-top)); right: 10px; background: transparent; border: none; padding: 4px; cursor: pointer;"
      >
        <ion-icon name="close" style="font-size: 18px; color: var(--ion-color-medium);"></ion-icon>
      </button>

      <div style="display: flex; align-items: flex-start; gap: 10px; padding-right: 24px;">
        <ion-icon name="refresh-circle" style="font-size: 24px; color: var(--ion-color-primary); flex-shrink: 0; margin-top: 2px;"></ion-icon>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 14px; font-weight: 700; color: var(--app-text-color);">
            {{ langService.t('update_available_title') }} v{{ updateService.latestVersion() }}
          </div>
          <div style="font-size: 12px; color: var(--ion-color-medium); margin-top: 4px; line-height: 1.35;">
            {{ langService.t('update_available_desc') }}
          </div>
          <ion-button
            [href]="updateService.apkDownloadUrl()"
            size="small"
            color="primary"
            style="margin: 10px 0 0 0; font-weight: 700; --border-radius: 8px;"
          >
            <ion-icon name="download-outline" slot="start"></ion-icon>
            {{ langService.t('update_now') }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
})
export class AppUpdateBannerComponent {
  public updateService = inject(AppUpdateService);
  public langService = inject(LanguageService);

  constructor() {
    addIcons({ close, downloadOutline, refreshCircle });
  }

  dismiss() {
    this.updateService.dismissUpdate(this.updateService.latestVersionCode());
  }
}
