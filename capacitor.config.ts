import type { CapacitorConfig } from '@capacitor/cli';

// Live APK loads your Render website — updates automatically after each deploy.
// Set CAPACITOR_LIVE=false before build to bundle code inside the APK instead.
const config: CapacitorConfig = {
  appId: 'com.thekedari.hub',
  appName: 'Thekedari',
  webDir: 'www',
  server: {
    url: 'https://thekedari-1.onrender.com',
    cleartext: false,
  },
};

export default config;
