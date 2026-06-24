# App Store 发布知识库 — 从零到上架完整手册

> 基于 PetMate 实战经验总结，适用于 Next.js + Capacitor + GitHub Actions 技术栈

---

## 一、前置条件速查

### 必需

| 条件 | 说明 |
|------|------|
| Apple Developer 账号 | $99/年，注册后 1-2 天审核 |
| App Store Connect API Key | Users and Access → Keys → App Store Connect API → Team Key |
| Team ID | developer.apple.com → Membership 页面找到 |
| App ID (Bundle ID) | Identifiers → 注册，格式 com.xxx.yyy |

### 可选

| 条件 | 说明 |
|------|------|
| 云 Mac | MacStadium/MacinCloud，发布前租1个月即可 |
| iPhone 真机 | 非必需，Archive 不需要设备 |

---

## 二、Windows 平台上 App Store 发布策略

### 核心原则：Windows 只做开发，Mac 只做签名上传

```
阶段 1: Windows 开发 + Vercel 部署 (日常)
    → PWA 已可在 iPhone 上全屏使用
    → 无需 Mac

阶段 2: 发布前 1 个月租云 Mac
    → 集中处理签名、上传、TestFlight
    → 成本 ~¥145/月

阶段 3: 上线后
    → 日常更新 → Vercel 自动部署
    → 版本更新 → 再租1天云 Mac 重新签名 ($1)
```

### 不要在 Windows 上做的事

```
❌ 不要用 npx cap add ios（生成 Windows 反斜杠路径）
❌ 不要手动改 Xcode 项目文件
❌ 不要在 Windows 上尝试代码签名
```

---

## 三、Capacitor SPM 常见陷阱

### 陷阱 1: Windows 生成的 Package.swift 包含反斜杠

```swift
// ❌ Windows 生成
.path("..\..\..\node_modules\@capacitor\camera")

// ✅ Mac/Linux 需要
.path("../../../node_modules/@capacitor/camera")
```

**修复**: `sed -i 's/\\\\/\//g' Package.swift` 或手动替换

### 陷阱 2: 本地插件路径在 CI/云 Mac 上不存在

```swift
// ❌ 依赖 node_modules 本地路径 — CI 和云 Mac 的 node_modules 结构可能不同
.path("../../../node_modules/@capacitor/camera")

// ✅ 只保留远程依赖，去掉所有本地可选插件
// Package.swift 只留 capacitor-swift-pm 核心
```

### 陷阱 3: cap sync 自动调用 CocoaPods

```
// capacitor.config.ts 必须显式声明
ios: {
  preferSwiftPackageManager: true  // 强制 SPM
}
```

### 陷阱 4: 缺少资源文件导致 Xcode 报错

`cap sync` 需要以下文件存在（可留空）：

```
ios/App/App/public/.gitkeep       → 空目录
ios/App/App/config.xml            → 空文件
ios/App/App/capacitor.config.json → 包含 appId/appName/webDir
```

---

## 四、代码签名问题速查表

### Bug 1: "No Team found in archive"

**原因**: Archive 没有 DEVELOPMENT_TEAM 元数据

**修复**: 
```
# project.pbxproj 添加：
DEVELOPMENT_TEAM = 你的TeamID;
```

### Bug 2: "No profiles for 'com.xxx.xxx' were found"

**原因**: 缺少 Provisioning Profile

**修复**:
```
developer.apple.com → Profiles → +:
  类型: iOS App Development
  App ID: 选你的
  Certificate: 全选
  → Download → 双击 .mobileprovision
```

### Bug 3: "Communication with Apple failed"

**原因**: 网络问题 或 账号未登录

**修复**:
```
Xcode → Settings → Accounts → + → 登录 Apple Developer 账号
```

### Bug 4: "Missing purpose string in Info.plist"

**原因**: 未声明隐私权限

**修复**: Info.plist 添加:
```xml
<key>NSCameraUsageDescription</key>
<string>App needs camera to take pet photos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>App needs photo library to upload photos.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>App needs permission to save photos.</string>
```

---

## 五、App Store Connect 常见问题

### 问题 1: Bundle ID 已被占用

换一个：`com.yourname.appname`。Developer 和 App Store Connect 两处必须一致。

### 问题 2: App 名称已被使用

加副标题或换语言变体：`PetMate宠物成长日记`。

### 问题 3: 上传后一直 Processing（黄色时钟）

正常。首次需 30 分钟到 2 小时。不是项目问题。

### 问题 4: 上传返回 500/HTML 错误但成功

Apple 服务器间歇性问题。警告可忽略，构建通常会成功。

### 问题 5: "Missing Compliance"

TestFlight → 构建 → 点进去 → Export Compliance → 选 `No`（不使用加密）。每年至少一次。

---

## 六、GitHub Actions CI 构建 iOS 经验

### 稳定方案（已验证）

```yaml
# 只构建 unsigned archive，不上传
# 签名由 Mac 本地 Xcode Organizer 完成
xcodebuild archive \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO
```

### 自动签名方案（条件苛刻）

```
需要同时满足:
  1. Package.swift 路径全正斜杠
  2. DEVELOPMENT_TEAM 已设置
  3. App Store Connect API Key 正确
  4. 网络能访问 Apple 服务器
  5. Provisioning Profile 已预置
```

### 自动上传方案（需要签名 IPA）

```
xcrun altool --upload-app -f app.ipa -t ios \
  --apiKey KEY_ID --apiIssuer ISSUER_ID --verbose
```

---

## 七、完整发布检查清单

### 发布前

```
□ Apple Developer 账号激活
□ App ID 已注册
□ Team ID 已知
□ App Store Connect App 已创建
□ Bundle ID 两处一致
□ capacitor.config.ts 已设置 preferSwiftPackageManager
□ Package.swift 路径为正斜杠
□ Info.plist 隐私声明已添加
□ ios/App/App/public 目录存在
□ ios/App/App/config.xml 存在
□ ios/App/App/capacitor.config.json 存在
□ Xcode 已登录 Developer 账号
□ Provisioning Profile 已安装
```

### Archive 前

```
□ 顶部设备选 Any iOS Device (arm64)
□ Signing & Capabilities → Automatically manage signing
□ Team 已选择
□ Bundle ID 正确
```

### 上传后

```
□ App Store Connect 构建状态 → Processing → Ready
□ TestFlight → 内部测试员添加
□ Export Compliance → No
□ 测试通过 → 提交审核
```

---

## 八、常见错误关键词速查

| 错误关键词 | 根因 | 方向 |
|-----------|------|------|
| `invalid escape sequence` | Package.swift 反斜杠 | 替换为 / |
| `No team found` | 缺少 Team ID | 加 DEVELOPMENT_TEAM |
| `No profiles` | 缺少 Provisioning | 手动创建 Profile |
| `Missing purpose string` | 缺少隐私声明 | Info.plist 加 NSCamera |
| `CapApp-SPM` | SPM 包解析失败 | 简化 Package.swift |
| `Communication with Apple` | 网络/账号问题 | 检查登录 |
| `Processing` 黄色 | 正常 | 等待 |
| `500` 上传错误 | Apple 服务器 | 忽略/重试 |
| `config.xml` 缺失 | 缺少资源文件 | 创建空文件 |
| `capacitor.config.json` 缺失 | cap sync 未执行 | 手动创建 |

---

> **一句话总结**: Windows 负责代码，Mac 负责签名。SPM 路径必须正斜杠。隐私声明不能忘。Apple 报 500 是常态。
