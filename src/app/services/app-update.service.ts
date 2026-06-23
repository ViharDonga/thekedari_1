import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { environment } from '../../environments/environment';

export interface RemoteVersionInfo {
  version: string;
  versionCode: number;
  apkUrl: string;
  releaseNotes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  private http = inject(HttpClient);

  public updateAvailable = signal(false);
  public latestVersion = signal('');
  public latestVersionCode = signal(0);
  public apkDownloadUrl = signal(`${environment.webUrl}/download`);
  public releaseNotes = signal('');

  async checkForUpdate(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const localCode = await this.getInstalledVersionCode();
    const cacheBust = Date.now();
    const url = `${environment.webUrl}/assets/version.json?t=${cacheBust}`;

    this.http.get<RemoteVersionInfo>(url).subscribe({
      next: (remote) => {
        const dismissed = parseInt(localStorage.getItem('dismissed_update_code') || '0', 10);
        if (remote.versionCode <= localCode || dismissed >= remote.versionCode) {
          return;
        }
        this.updateAvailable.set(true);
        this.latestVersion.set(remote.version);
        this.latestVersionCode.set(remote.versionCode);
        this.apkDownloadUrl.set(remote.apkUrl || `${environment.webUrl}/download`);
        this.releaseNotes.set(remote.releaseNotes || '');
      },
      error: () => {
        // Offline or server unreachable — skip silently
      },
    });
  }

  dismissUpdate(versionCode?: number): void {
    this.updateAvailable.set(false);
    if (versionCode) {
      localStorage.setItem('dismissed_update_code', String(versionCode));
    }
  }

  getInstalledVersionLabel(): string {
    return environment.appVersion;
  }

  private async getInstalledVersionCode(): Promise<number> {
    try {
      const info = await App.getInfo();
      const build = parseInt(info.build, 10);
      if (!Number.isNaN(build) && build > 0) {
        return build;
      }
      return environment.versionCode;
    } catch {
      return environment.versionCode;
    }
  }
}
