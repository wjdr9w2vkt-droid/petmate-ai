# PetMate 发布流程指南

> 从 GitHub 到 App Store — 完整步骤

---

## 路线图

```
现在  PWA 使用中 ✅
  │
  ▼
第1步  GitHub 仓库建立          (30分钟)
  │
  ▼
第2步  环境变量 + Secrets        (10分钟)
  │
  ▼
第3步  Apple Developer 注册      (1-3天审核)
  │
  ▼
第4步  App Store Connect 创建    (30分钟)
  │
  ▼
第5步  GitHub Actions 构建       (自动)
  │
  ▼
第6步  TestFlight 分发           (10分钟)
  │
  ▼
第7步  App Store 提交审核       (1-3天)
  │
  ▼
✅ PetMate 上线 App Store
```

---

## 第 1 步：GitHub 仓库建立

### 1.1 创建仓库

```
1. 打开 https://github.com/new
2. Repository name: petmate-ai
3. Description: 🐾 PetMate AI - 数字养宠管家
4. Public / Private: 任选
5. 不要勾选 "Add a README"（项目已有）
6. 点击 Create repository
```

### 1.2 推送代码

在 Windows 终端执行：

```bash
cd "d:\git test\petmate-ai"

# 初始化 Git（如果还没做）
git init
git add .
git commit -m "PetMate v2.0 — Release Ready"

# 关联远程仓库
git remote add origin https://github.com/你的用户名/petmate-ai.git

# 推送
git branch -M main
git push -u origin main
```

### 1.3 验证

```
打开 https://github.com/你的用户名/petmate-ai
确认所有文件已上传
```

---

## 第 2 步：GitHub Secrets 配置

### 2.1 添加密钥

```
GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret
```

逐个添加以下 3 个 Secret：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cjlwrsmzqmbcnernmkkv.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_8H-AHmtsTAu4japf4KGdAQ_ZdLc7rwb` |
| `NEXT_PUBLIC_APP_URL` | `https://petmate-nomjtnjor-wjdr9w2vkt-droids-projects.vercel.app` |

### 2.2 触发首次构建

```
GitHub 仓库 → Actions → Build iOS App → Run workflow → Run workflow
```

等待约 5-8 分钟，构建完成后下载 `PetMate-iOS` artifact。

---

## 第 3 步：Apple Developer 注册

### 3.1 注册账号

```
1. 打开 https://developer.apple.com
2. 点击 Account → 登录 Apple ID（没有则创建）
3. 点击 Enroll → 选择 Individual
4. 填写个人信息（中英文均可）
5. 支付 $99/年
6. 等待审核邮件（通常 1-2 天）
```

### 3.2 验证

```
审核通过后会收到邮件："Welcome to the Apple Developer Program"
登录 https://developer.apple.com/account
确认显示 "Apple Developer Program" 状态为 Active
```

---

## 第 4 步：App Store Connect 创建

### 4.1 创建 App

```
1. 打开 https://appstoreconnect.apple.com
2. 点击 Apps → 左上角 ⊕ → New App
3. 填写：
   Platform:          iOS
   Name:              PetMate
   Primary Language:  Simplified Chinese
   Bundle ID:         com.petmate.app
   SKU:               petmate-2026-001
   User Access:       Full Access
4. 点击 Create
```

### 4.2 填写 App 信息

```
App Store Connect → PetMate → App Information

✅ 名称:     PetMate - 宠物成长日记
✅ 副标题:   AI助手 & 成长记录 & 疫苗提醒
✅ 分类:     生活 (Primary) / 健康健美 (Secondary)
✅ 价格:     免费
✅ 地区:     中国 / 全球

隐私政策 URL:  https://petmate-nomjtnjor-wjdr9w2vkt-droids-projects.vercel.app/privacy
用户协议 URL:  同上（或创建单独页面）
```

---

## 第 5 步：证书配置

### 5.1 Xcode 自动管理（推荐）

```
GitHub Actions 构建时使用自动签名：
- Xcode 自动创建 Development/ Distribution 证书
- 自动注册 App ID 和 Provisioning Profile
- 无需手动操作证书
```

### 5.2 如需手动

```
仅在 GitHub Actions 构建失败时使用：

1. Xcode → Preferences → Accounts → 添加 Apple ID
2. 项目 → Signing & Capabilities → 勾选 Automatically manage signing
3. Team 选择你的账号
```

---

## 第 6 步：构建并上传

### 6.1 GitHub Actions 构建（自动）

```
每次 push 到 main 分支自动触发
或手动: Actions → Build iOS App → Run workflow
```

### 6.2 上传到 App Store Connect

```bash
# 在 macOS 上（或 GitHub Actions 中）

# 验证 App
xcrun altool --validate-app \
  -f PetMate.ipa \
  -t ios \
  --apiKey YOUR_KEY_ID \
  --apiIssuer YOUR_ISSUER_ID

# 上传
xcrun altool --upload-app \
  -f PetMate.ipa \
  -t ios \
  --apiKey YOUR_KEY_ID \
  --apiIssuer YOUR_ISSUER_ID
```

> GitHub Actions 可配置自动上传，需添加 App Store Connect API Key。

---

## 第 7 步：TestFlight 分发

### 7.1 准备测试

```
1. App Store Connect → PetMate → TestFlight
2. 构建出现后 → 填写测试信息：
   - What to Test: 核心功能测试 + UI体验反馈
   - 联系邮箱: 你的邮箱
3. 添加测试员：
   - Internal: 你的开发团队（最多 100 人）
   - External: 外部测试员（最多 10,000 人，需审核）
```

### 7.2 邀请测试员

```
Internal Testing（无需审核）:
  App Store Connect → Users and Access → 添加用户
  → TestFlight → 选择构建 → 添加内部测试员

External Testing（需 Beta App Review，通常 1 天）:
  TestFlight → External Testing → 创建群组
  → 添加测试员邮箱 → 提交审核
```

### 7.3 测试员体验

```
测试员收到邮件 → 安装 TestFlight App → 下载 PetMate
→ 使用 90 天 → 通过 TestFlight 提交反馈
```

---

## 第 8 步：App Store 提交

### 8.1 最终检查清单

```
□ App 信息完整（名称/副标题/描述/关键词/分类）
□ 截图已上传（6.9寸 ×6张，见 APP_STORE_PREPARATION.md）
□ App 图标 1024×1024 已上传
□ 隐私政策 URL 可访问
□ 价格已设置（免费）
□ 地区已选择
□ 年龄评级已设定（4+）
□ 版权信息已填写
□ TestFlight 至少有一次构建通过
```

### 8.2 提交审核

```
1. App Store Connect → PetMate → Prepare for Submission
2. 填写 Export Compliance: No
3. 填写 Advertising Identifier: No
4. 点击 Submit for Review
5. 状态变为 "Waiting for Review"
```

### 8.3 审核周期

```
通常: 1-3 天
高峰期（节假日）: 可能更长
如果被拒: 修改后重新提交
```

### 8.4 审核通过

```
收到通知 → 点击 Release This Version → App 上架
24 小时内可在 App Store 搜索到 PetMate
```

---

## 快速操作卡

```bash
# 日常更新流程
git add .
git commit -m "描述改动"
git push
# → GitHub Actions 自动构建
# → 下载新 IPA
# → 上传 App Store Connect
# → 提交新版本

# 查看构建状态
https://github.com/你的用户名/petmate-ai/actions

# 查看 App 状态
https://appstoreconnect.apple.com
```

---

## 重要链接

```
PetMate 线上:     https://petmate-nomjtnjor-wjdr9w2vkt-droids-projects.vercel.app
GitHub Actions:    https://github.com/你的用户名/petmate-ai/actions
App Store Connect: https://appstoreconnect.apple.com
Apple Developer:   https://developer.apple.com/account
Supabase:          https://supabase.com/dashboard/project/cjlwrsmzqmbcnernmkkv
Vercel:            https://vercel.com/wjdr9w2vkt-droids-projects/petmate-ai
```

---

## 时间预估

| 步骤 | 时间 |
|------|------|
| GitHub 推送 | 30 分钟 |
| Apple Developer 注册 + 审核 | 1-3 天 |
| App Store Connect 配置 | 30 分钟 |
| GitHub Actions 首次构建 | 10 分钟 |
| TestFlight 内部测试 | 即时 |
| TestFlight 外部测试审核 | 1 天 |
| App Store 提交审核 | 1-3 天 |
| **总计（从零到上架）** | **约 1 周** |
