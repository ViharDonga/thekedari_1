import { Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({
  providedIn: 'root',
})
export class PwaInstallService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  /** Chrome/Edge “Install app” native prompt is available. */
  public canNativePrompt = signal(false);
  /** Opened from home screen / installed PWA shell. */
  public isStandalone = signal(this.checkStandalone());
  /** Phone or tablet browser (not desktop). */
  public isMobileWeb = signal(this.checkMobileWeb());

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.canNativePrompt.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.canNativePrompt.set(false);
      this.isStandalone.set(true);
    });
  }

  /** Website in a normal browser tab — show install UI. */
  shouldOfferInstall(): boolean {
    return !Capacitor.isNativePlatform() && !this.isStandalone();
  }

  isIos(): boolean {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  async promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferredPrompt) {
      return 'unavailable';
    }

    await this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.canNativePrompt.set(false);
    return outcome;
  }

  private checkStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  }

  private checkMobileWeb(): boolean {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
}
