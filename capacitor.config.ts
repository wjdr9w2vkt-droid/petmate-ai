import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.MrGaryW.petmate',
  appName: 'PetMate',
  webDir: 'out',
  server: {
    // 固定别名，不会随每次 vercel --prod 部署而改变（不要换成 petmate-xxxxx-*.vercel.app 那种随机域名，
    // 那种域名默认带 Vercel Deployment Protection/SSO，外部用户和 App 内嵌 WebView 都打不开）
    url: 'https://project-4v5mr.vercel.app',
    cleartext: false,
    allowNavigation: ['*'],
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
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
