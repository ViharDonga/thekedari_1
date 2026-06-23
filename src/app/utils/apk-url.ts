import { environment } from '../../environments/environment';

/** Direct APK file on the static website — works when user taps Download on Render. */
export function getApkDownloadUrl(): string {
  return `${environment.webUrl.replace(/\/$/, '')}/assets/thekedari.apk`;
}
