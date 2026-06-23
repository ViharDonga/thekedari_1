import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, 
  IonButtons, IonToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, checkmarkCircle, shieldCheckmark, sunny, moon, logoAndroid, downloadOutline } from 'ionicons/icons';
import { LanguageService, SupportedLanguage } from '../services/language.service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, 
    IonButtons, IonToggle
  ],
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar class="glass-panel">
        <ion-title style="color: var(--app-text-color); font-weight: 700;">{{ langService.t('settings_title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-icon name="close" style="font-size: 24px; color: var(--ion-color-danger);"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" style="--background: var(--bg-dark-base);">
      <!-- Decorative Glow -->
      <div style="position: absolute; width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,159,10,0.04) 0%, rgba(0,0,0,0) 70%); top: 50px; right: -50px; pointer-events: none; z-index: -1;"></div>

      <!-- Language Selector -->
      <div class="glass-panel" style="padding: 16px; margin-bottom: 16px; margin-top: 10px;">
        <h3 style="margin: 0 0 14px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--ion-color-primary);">
          {{ langService.t('select_language') }}
        </h3>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <!-- English -->
          <div 
            (click)="setLang('en')"
            [style.border-color]="langService.currentLanguage() === 'en' ? 'var(--ion-color-primary)' : 'var(--border-light)'"
            [style.background]="langService.currentLanguage() === 'en' ? 'rgba(255, 159, 10, 0.05)' : 'rgba(255,255,255,0.01)'"
            style="padding: 14px 16px; border: 1px solid; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s;"
          >
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 22px;">🇬🇧</span>
              <span style="font-weight: 600; color: var(--app-text-color); font-size: 14px;">{{ langService.t('english') }}</span>
            </div>
            <ion-icon *ngIf="langService.currentLanguage() === 'en'" name="checkmark-circle" color="primary" style="font-size: 20px;"></ion-icon>
          </div>

          <!-- Hindi -->
          <div 
            (click)="setLang('hi')"
            [style.border-color]="langService.currentLanguage() === 'hi' ? 'var(--ion-color-primary)' : 'var(--border-light)'"
            [style.background]="langService.currentLanguage() === 'hi' ? 'rgba(255, 159, 10, 0.05)' : 'rgba(255,255,255,0.01)'"
            style="padding: 14px 16px; border: 1px solid; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s;"
          >
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 22px;">🇮🇳</span>
              <span style="font-weight: 600; color: var(--app-text-color); font-size: 14px;">{{ langService.t('hindi') }}</span>
            </div>
            <ion-icon *ngIf="langService.currentLanguage() === 'hi'" name="checkmark-circle" color="primary" style="font-size: 20px;"></ion-icon>
          </div>

          <!-- Gujarati -->
          <div 
            (click)="setLang('gu')"
            [style.border-color]="langService.currentLanguage() === 'gu' ? 'var(--ion-color-primary)' : 'var(--border-light)'"
            [style.background]="langService.currentLanguage() === 'gu' ? 'rgba(255, 159, 10, 0.05)' : 'rgba(255,255,255,0.01)'"
            style="padding: 14px 16px; border: 1px solid; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s;"
          >
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 22px;">🌾</span>
              <span style="font-weight: 600; color: var(--app-text-color); font-size: 14px;">{{ langService.t('gujarati') }}</span>
            </div>
            <ion-icon *ngIf="langService.currentLanguage() === 'gu'" name="checkmark-circle" color="primary" style="font-size: 20px;"></ion-icon>
          </div>
        </div>
      </div>

      <!-- Theme Selector -->
      <div class="glass-panel" style="padding: 16px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 14px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--ion-color-primary);">
          {{ langService.t('theme_section') }}
        </h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <!-- Light Theme Button -->
          <div 
            (click)="setTheme('light')"
            [style.border-color]="langService.currentTheme() === 'light' ? 'var(--ion-color-primary)' : 'var(--border-light)'"
            [style.background]="langService.currentTheme() === 'light' ? 'rgba(255, 159, 10, 0.05)' : 'rgba(255,255,255,0.01)'"
            style="padding: 14px; border: 1px solid; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s;"
          >
            <ion-icon name="sunny" style="font-size: 20px; color: var(--ion-color-primary);"></ion-icon>
            <span style="font-weight: 600; color: var(--app-text-color); font-size: 14px;">{{ langService.t('light_theme') }}</span>
          </div>

          <!-- Dark Theme Button -->
          <div 
            (click)="setTheme('dark')"
            [style.border-color]="langService.currentTheme() === 'dark' ? 'var(--ion-color-primary)' : 'var(--border-light)'"
            [style.background]="langService.currentTheme() === 'dark' ? 'rgba(255, 159, 10, 0.05)' : 'rgba(255,255,255,0.01)'"
            style="padding: 14px; border: 1px solid; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s;"
          >
            <ion-icon name="moon" style="font-size: 20px; color: var(--ion-color-primary);"></ion-icon>
            <span style="font-weight: 600; color: var(--app-text-color); font-size: 14px;">{{ langService.t('dark_theme') }}</span>
          </div>
        </div>
      </div>

      <!-- Business Profile Info -->
      <div class="glass-panel" style="padding: 16px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 14px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--ion-color-primary);">
          {{ langService.t('profile_section') }}
        </h3>
        
        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 8px;">
            <span style="color: var(--ion-color-medium);">{{ langService.t('biz_name') }}</span>
            <span style="color: var(--app-text-color); font-weight: 600;">Balaji Builders & Contractors</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 8px;">
            <span style="color: var(--ion-color-medium);">{{ langService.t('contractor_license') }}</span>
            <span style="color: var(--ion-color-success); font-weight: 600; display: flex; align-items: center; gap: 4px;">
              <ion-icon name="shield-checkmark"></ion-icon>
              {{ langService.t('verified') }}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--ion-color-medium);">{{ langService.t('backup_sync') }}</span>
            <ion-toggle [checked]="true" color="primary"></ion-toggle>
          </div>
        </div>
      </div>

      <!-- Android App Download -->
      <div class="glass-panel" style="padding: 16px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--ion-color-primary);">
          Android Application
        </h3>
        <p style="margin: 0 0 12px 0; font-size: 12px; color: var(--ion-color-medium); line-height: 1.4;">
          {{ langService.t('download_app_banner_desc') }}
        </p>
        <ion-button href="/assets/thekedari.apk" download="thekedari.apk" expand="block" color="secondary" style="--border-radius: 12px; font-weight: 700; height: 40px; margin: 0;">
          <ion-icon name="logo-android" slot="start" style="font-size: 20px;"></ion-icon>
          {{ langService.t('download_now') }}
        </ion-button>
      </div>

      <!-- App Version Info -->
      <div class="glass-panel" style="padding: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--ion-color-medium);">
        <span>{{ langService.t('app_version') }}</span>
        <span>v1.2.0 (Stable)</span>
      </div>

      <!-- Save Button -->
      <ion-button expand="block" color="primary" style="margin-top: 24px; --border-radius: 12px; font-weight: 700; height: 46px;" (click)="close()">
        {{ langService.t('done') }}
      </ion-button>
    </ion-content>
  `
})
export class SettingsModalComponent {
  public langService = inject(LanguageService);

  @Output() dismiss = new EventEmitter<void>();

  constructor() {
    addIcons({ close, checkmarkCircle, shieldCheckmark, sunny, moon, logoAndroid, downloadOutline });
  }

  setLang(lang: SupportedLanguage) {
    this.langService.setLanguage(lang);
  }

  setTheme(theme: 'dark' | 'light') {
    this.langService.setTheme(theme);
  }

  close() {
    this.dismiss.emit();
  }
}
