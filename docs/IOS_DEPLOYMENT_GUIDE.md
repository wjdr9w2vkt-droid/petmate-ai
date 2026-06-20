# PetMate for iPhone — Capacitor 部署指南

---

## 一、架构

```
┌─────────────────────────────────────────┐
│             PetMate App                  │
│  ┌─────────────────────────────────┐    │
│  │     Capacitor WebView           │    │
│  │  ┌───────────────────────────┐  │    │
│  │  │  Next.js (next export)    │  │    │
│  │  │  PetMate PWA              │  │    │
│  │  └───────────────────────────┘  │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │     Capacitor Native Bridge     │    │
│  │  📅 EventKit  🔔 APNs  📸 Camera │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## 二、环境准备

### 前置条件

```bash
# macOS 必需
# Xcode 16+
# Node.js 24+
# Apple Developer Account ($99/年)
```

### 安装

```bash
cd petmate-ai
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios
npm install @capacitor/splash-screen
npm install @capacitor/local-notifications
npm install @capacitor/share
npm install @capacitor/camera
npm install @capacitor/filesystem
```

## 三、初始化

```bash
npx cap init PetMate com.petmate.app \
  --web-dir=out \
  --npm-client=npm

npx cap add ios
```

## 四、Next.js 配置

```javascript
// next.config.ts
const nextConfig = {
  output: 'export', // 静态导出
  images: { unoptimized: true },
}
```

## 五、构建流程

```bash
# 1. 构建静态文件
npm run build       # → out/

# 2. 同步到 iOS 工程
npx cap sync ios

# 3. 打开 Xcode
npx cap open ios
```

## 六、Xcode 配置

### Signing & Capabilities

```
Team:         你的 Apple Developer 账号
Bundle ID:    com.petmate.app
Version:      1.0.0
Build:        1

Capabilities:
  ✅ Push Notifications
  ✅ Background Modes (remote-notification)
```

### Info.plist 关键配置

```xml
<key>CFBundleDisplayName</key>
<string>PetMate</string>
<key>CFBundleName</key>
<string>PetMate</string>
<key>UILaunchStoryboardName</key>
<string>LaunchScreen</string>
<key>UIStatusBarStyle</key>
<string>UIStatusBarStyleLightContent</string>
<key>UIViewControllerBasedStatusBarAppearance</key>
<false/>
<key>NSCameraUsageDescription</key>
<string>PetMate 需要访问相机来拍摄宠物照片</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>PetMate 需要访问相册来保存宠物照片</string>
```

## 七、真机运行

```bash
# 连接 iPhone → 信任设备 → Xcode 选择设备 → Run (⌘R)
npx cap run ios
```

## 八、TestFlight 发布

```
1. Xcode → Product → Archive
2. Organizer → Distribute App → TestFlight
3. App Store Connect → TestFlight → 添加测试员
4. 测试员收到邮件 → 安装 TestFlight → 下载 PetMate
```

## 九、App Store 发布

```
1. App Store Connect → 创建 App
2. 填写元数据（见 APP_STORE_PREPARATION.md）
3. Xcode Archive → Distribute → App Store Connect
4. 提交审核（审核周期 1-3 天）
```

## 十、版本更新

```bash
npm run build           # 更新 Web 代码
npx cap sync ios        # 同步到原生
npx cap open ios        # Xcode → Archive → 上传新版本
```

---

> **注意**：Next.js `output: 'export'` 模式下 API Routes 不可用。需将 API 逻辑迁移到 Supabase Edge Functions 或保留 Vercel 后端。
