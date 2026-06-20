# 🐾 PetMate AI — 你的数字养宠管家

智能宠物健康管理助手。记录宠物成长、追踪体重变化、管理疫苗提醒，AI 解答养宠问题。

## 技术栈

- **框架**: Next.js 16 + React 19 + TypeScript
- **样式**: TailwindCSS v4 + shadcn/ui
- **数据库**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **ORM**: Drizzle ORM
- **AI**: DeepSeek / OpenAI (兼容 SDK，用户自行配置 Key)
- **状态**: Zustand
- **表单**: React Hook Form + Zod
- **图表**: Recharts
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd petmate-ai
npm install
```

### 2. 配置 Supabase

1. 在 [supabase.com](https://supabase.com) 创建项目
2. 在 SQL Editor 执行 `supabase/migrations/0000_initial_schema.sql`
3. 复制 `.env.local.example` 为 `.env.local`，填入 Supabase 凭据

### 3. 启动开发服务器

```bash
npm run dev
# → http://localhost:3000
```

### 4. 配置 AI（在应用内）

1. 注册/登录
2. 进入 `/profile` → 「AI API 设置」
3. 填入你的 API Key、模型、API 地址
4. 支持 DeepSeek (`https://api.deepseek.com`) / OpenAI 等兼容接口

## 环境变量

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # 可选，用于 Storage 和迁移

# Database
DATABASE_URL=postgresql://...            # Drizzle 迁移用

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 功能模块

| 模块 | 功能 |
|------|------|
| 用户系统 | 邮箱注册/登录、个人中心 |
| 宠物档案 | CRUD + 头像上传 |
| 成长记录 | 体重/饮食/运动记录、趋势图 |
| 疫苗管理 | 接种记录、到期倒计时 |
| AI 助手 | 流式对话、宠物上下文、结构化回答 |
| Dashboard | 概览卡片、快捷操作、养宠贴士 |

## 数据库

- 6 张表 + 16 条 RLS Policy + 2 个 Trigger + 1 个 View
- 行级安全：每个用户数据完全隔离

## 部署 Vercel

```bash
npm run build       # 构建验证
vercel --prod       # 部署到 Vercel
```

在 Vercel Dashboard → Settings → Environment Variables 中添加所有 `NEXT_PUBLIC_*` 变量。

## 项目结构

```
src/
├── app/            # Next.js App Router（14 页面 + 3 API）
├── components/     # 22 个 UI 组件
├── hooks/          # 5 个自定义 Hook
├── lib/            # 工具库（Supabase/DB/AI/校验/工具）
├── stores/         # 3 个 Zustand Store
└── types/          # TypeScript 类型
```

## License

MIT
