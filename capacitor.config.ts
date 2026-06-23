import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.MrGaryW.petmate',
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
    preferSwiftPackageManager: true,
    scheme: 'App',
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
