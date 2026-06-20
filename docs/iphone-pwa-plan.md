# iPhone 优先适配 + PWA/App 化 — 技术方案

> PetMate 拥抱 Apple 生态。iPhone first，优雅触达。

---

## 一、iPhone 适配清单

### 安全区

```css
/* 已实施 ✅ */
header  { padding-top: env(safe-area-inset-top); }
bottom-nav { padding-bottom: env(safe-area-inset-bottom); }

/* 后续补充 */
main-content { padding-left: env(safe-area-inset-left);
               padding-right: env(safe-area-inset-right); }
```

### 触控优化

```
最小触控区域: 44×44pt（Apple HIG 标准）
按钮高度:     ≥ 44px
列表行高:     ≥ 44px
图标按钮:     p-2 (32px 视觉 + 12px padding = 44px 触控)
```

### 设备适配

```
iPhone 15 / 15 Pro:    393×852 pt
iPhone 16 / 16 Pro:    402×874 pt
iPhone 16 Pro Max:     430×932 pt
iPhone SE:             375×667 pt

所有页面在 375pt 宽度下完整可用
```

### 交互规范

```
✅ 左右滑动返回（利用 iOS Safari 原生手势）
✅ 下拉刷新（原生感觉）
✅ 点击反馈（active: scale(0.97)）
✅ 模态从底部弹出（iOS Style Sheet）
✅ 长按菜单（iOS Haptic Touch 感觉）
```

### 字体适配

```css
/* iOS 系统字体优先 */
--font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Text',
             'PingFang SC', 'Hiragino Sans GB', sans-serif;

/* 动态字体大小 */
html { -webkit-text-size-adjust: 100%; }
```

---

## 二、PWA 增强

### 当前状态

```
✅ manifest.json
✅ Service Worker
✅ 离线回退页
✅ iOS meta tags
✅ 全屏 standalone 模式
✅ 启动图标（SVG 爪印）
```

### 待增强

```
⬜ 启动画面（Splash Screen）—— 多设备尺寸
⬜ 顶部状态栏颜色匹配
⬜ 底部安全区适配
⬜ PWA 更新提示
⬜ 离线数据缓存策略优化
⬜ Background Sync（未来）
⬜ Push Notification（未来）
```

### Splash Screen 多设备

```html
<!-- iPhone 16 Pro Max -->
<link rel="apple-touch-startup-image"
  media="(device-width: 430px) and (device-height: 932px)"
  href="/splash-430-932.png">

<!-- iPhone 16 / 16 Pro -->
<link rel="apple-touch-startup-image"
  media="(device-width: 402px) and (device-height: 874px)"
  href="/splash-402-874.png">

<!-- iPhone SE -->
<link rel="apple-touch-startup-image"
  media="(device-width: 375px) and (device-height: 667px)"
  href="/splash-375-667.png">
```

---

## 三、Capacitor 打包路线图

### Phase 1: PWA 完善（当前）

```
目标：PWA 达到 App-like 体验
工作量：3天
```

### Phase 2: Capacitor 集成（下一阶段）

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios
npx cap init PetMate com.petmate.app
npx cap add ios
```

### Phase 3: 原生能力

```
📅 EventKit    → Apple Calendar 集成
🔔 APNs        → Push Notification
📸 Camera      → 原生相机拍照
🖼 Photos      → 保存到相册
📤 Share Sheet → 原生分享
```

### Phase 4: App Store 发布

```
- Apple Developer Program 注册
- App Store Connect 配置
- TestFlight 内测
- 隐私政策 + 用户协议
- 截图 + 预览视频
- 提交审核
```

---

## 四、实施预估

| 阶段 | 内容 | 预估 |
|------|------|------|
| P1 | iPhone 安全区 + 触控 + 字体适配 | 1天 |
| P2 | Splash Screen 多设备 | 0.5天 |
| P3 | PWA 缓存策略优化 | 1天 |
| **合计** | | **2.5天** |

> Capacitor 打包（Phase 2-4）暂列入后续规划，不在本轮实施。
