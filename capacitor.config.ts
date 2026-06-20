import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.petmate.app',
  appName: 'PetMate',
  webDir: 'out',
  server: {
    url: 'https://petmate-nomjtnjor-wjdr9w2vkt-droids-projects.vercel.app',
    cleartext: false,
    allowNavigation: ['*'],
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FDF9F5',
      showSpinner: false,
    },
  },
};

export default config;
