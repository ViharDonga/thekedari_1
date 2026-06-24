import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { getApkDownloadUrl } from '../utils/apk-url';

@Injectable({
  providedIn: 'root',
})
export class ApkInstallService {
  /** Android phone browser only — not when already running the native app. */
  shouldOfferApk(): boolean {
    return !Capacitor.isNativePlatform() && /Android/i.test(navigator.userAgent);
  }

  getDownloadUrl(): string {
    return getApkDownloadUrl();
  }

  downloadApk(): void {
    window.location.assign(this.getDownloadUrl());
  }
}
