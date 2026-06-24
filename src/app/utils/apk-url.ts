import { environment } from '../../environments/environment';

/** Direct APK file on the static website — ?v= busts CDN/browser cache after each release. */
export function getApkDownloadUrl(): string {
  const base = `${environment.webUrl.replace(/\/$/, '')}/assets/thekedari.apk`;
  return `${base}?v=${environment.versionCode}`;
}
