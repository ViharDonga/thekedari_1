import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thekedari.hub',
  appName: 'Thekedari',
  webDir: 'www',
  server: {
    url: 'https://thekedari-web.onrender.com',
    cleartext: false,
  },
};

export default config;
