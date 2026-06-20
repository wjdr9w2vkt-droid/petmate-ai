# PetMate i18n 国际化实施方案

---

## 一、技术选型

```
next-intl (推荐)
理由:
  ✅ Next.js 16 原生支持
  ✅ Server/Client Component 双端可用
  ✅ 类型安全翻译
  ✅ 语言切换无需刷新
```

## 二、第一阶段语言

```
zh-CN    简体中文    ✅ 当前
en        English     🎯 Phase 2
ja        日本語      🎯 Phase 3
```

## 三、文件结构

```
src/
├── messages/
│   ├── zh-CN.json    ← 中文翻译
│   ├── en.json       ← 英文翻译
│   └── ja.json       ← 日文翻译
├── i18n/
│   ├── request.ts    ← Server i18n config
│   ├── routing.ts    ← 路由中间件
│   └── navigation.ts ← 语言切换
```

## 四、翻译示例

### zh-CN.json

```json
{
  "nav": { "home": "首页", "records": "记录", "reminders": "提醒" },
  "pets": {
    "title": "我的宠物",
    "empty": "还没有宠物",
    "add": "新增宠物"
  },
  "auth": {
    "login": "登录",
    "register": "注册",
    "logout": "退出登录"
  }
}
```

### en.json

```json
{
  "nav": { "home": "Home", "records": "Records", "reminders": "Reminders" },
  "pets": {
    "title": "My Pets",
    "empty": "No pets yet",
    "add": "Add Pet"
  },
  "auth": {
    "login": "Sign In",
    "register": "Sign Up",
    "logout": "Sign Out"
  }
}
```

## 五、核心组件

```tsx
// 语言切换器
function LanguageSwitcher() {
  return (
    <select onChange={(e) => setLocale(e.target.value)}>
      <option value="zh-CN">🇨🇳 中文</option>
      <option value="en">🇺🇸 English</option>
      <option value="ja">🇯🇵 日本語</option>
    </select>
  )
}
```

## 六、实施预估

| 阶段 | 内容 | 工作量 |
|------|------|--------|
| 1 | 安装 next-intl + 路由配置 | 1h |
| 2 | 提取所有中文硬编码文字 | 3h |
| 3 | 英文翻译 | 2h |
| 4 | 日文翻译 | 2h |
| 5 | 语言切换器 + 测试 | 1h |
| **合计** | | **9h** |

## 七、国际化检查清单

```
⬜ 页面标题
⬜ 导航标签
⬜ 按钮文字
⬜ 表单 label
⬜ 错误提示
⬜ Toast 消息
⬜ 空状态文案
⬜ 日期格式（中文: 6月19日, EN: Jun 19）
⬜ AI System Prompt 多语言版本
⬜ 疫苗/物种等枚举值翻译
```
