# PetMate AI — 项目总览

> 为 AI 助手准备的完整项目上下文。读取此文件即可接手开发。

---

## 一、项目定位

**PetMate AI** — 温暖的宠物陪伴空间。不是管理工具，是帮助主人记录宠物成长、保存回忆、守护健康的 AI 助手。

- **用户画像**: 25-35 岁养宠新手，iPhone 用户为主
- **产品人格**: 温柔、耐心、治愈、值得信任
- **设计风格**: 暖棕奶油色，圆润，柔和动效

---

## 二、技术栈

```
框架:     Next.js 16 (App Router + Turbopack)
语言:     TypeScript 5
样式:     TailwindCSS v4 + shadcn/ui (base-nova)
数据库:   Supabase (PostgreSQL + Auth + Storage + RLS)
认证:     Supabase Auth (Email only)
AI:       用户自行配置 DeepSeek/OpenAI API Key
状态:     Zustand (persist localStorage)
表单:     React Hook Form + Zod
图表:     Recharts
部署:     Vercel + GitHub Actions (iOS 构建)
原生:     Capacitor (iOS App 壳)
```

---

## 三、目录结构 (21 routes, 22 components, 9 hooks, 8 tables)

```
petmate-ai/
├── src/app/
│   ├── (auth)/              # /login, /register
│   ├── (dashboard)/         # /, /pets/[id]*, /records, /reminders, /ai, /profile
│   │   ├── pets/[id]/timeline/  # 成长时间轴
│   │   └── pets/[id]/photos/    # 纪念相册
│   └── api/                 # ai/chat (SSE), auth/callback, upload
├── src/components/          # layout/, pets/, records/, ai/, dashboard/, shared/, ui/
├── src/hooks/               # use-auth, use-pets, use-records, use-vaccines, use-timeline, use-reminders, use-ai-chat, use-dashboard, use-image-upload
├── src/lib/                 # supabase/, db/, ai/, validators/, utils/
├── src/stores/              # auth-store, api-settings-store, ui-store
├── src/types/index.ts
├── docs/                    # 17 份设计/计划文档
├── supabase/migrations/     # 0000_initial_schema.sql, 0001_timeline_events.sql
├── ios/                     # Capacitor iOS 工程
├── .github/workflows/       # ios-build.yml
└── capacitor.config.ts
```

---

## 四、数据库 (8 张表, 全 RLS)

| 表 | 核心字段 | 关键约束 |
|----|----------|----------|
| profiles | id(FK→auth.users), display_name, avatar_url | trigger 自动创建 |
| pets | user_id, name, species, breed, gender, birthday | user_id 索引 |
| growth_records | pet_id, recorded_at, weight, food_note | UNIQUE(pet_id, date) |
| vaccinations | pet_id, vaccine_name, vaccinated_at, next_due_date | next_due 索引 |
| ai_conversations | user_id, pet_id(可选), question, answer, model | user_id+created_at 复合索引 |
| timeline_events | pet_id, event_type, title, photo_url, event_date | pet_id+date 复合索引 |
| reminders | user_id, pet_id, type, title, due_date, repeat_type | due_date 索引 |

RLS: 直接表 `auth.uid()=user_id`, 级联表 `EXISTS(pets...)`

---

## 五、关键架构决策

### snake_case 要注意
Supabase 返回 snake_case (recorded_at), TS 类型用 camelCase (recordedAt)。当前各处用 `(data as any).snake_case ?? data.camelCase` 兜底。`src/lib/utils/data-mapper.ts` 已备好可统一转换。

### 暗色模式
`@media (prefers-color-scheme: dark)` 跟随 iPhone 系统自动切换。爪印背景用内联 SVG data URI, 500px 间距, 4-5% 透明度。

### shadcn/ui 无 asChild
Button 用 `@base-ui/react`, 不支持 `asChild`。用 `<Link>` 样式或 `<Button onClick={router.push}>`。

### API 最简
仅 3 个 API Route, 其余 CRUD 直接用 Supabase Client + RLS。

---

## 六、当前状态

完成: 用户认证, 宠物CRUD, 成长记录+趋势图, 疫苗管理, AI助手, Dashboard, 时间轴, 提醒中心, 纪念相册, PWA, Capacitor iOS, 暗色模式, 爪印背景

已知: snake_case 统一转换待做（`data-mapper.ts` 已备好未接入）, TestFlight 需 Distribution 证书

⚠️ **重要教训（2026-07 曾踩坑）**:
1. Vercel 每次 `vercel --prod` 不指定域名都会生成一个新的随机子域名
   (`petmate-xxxxx-wjdr9w2vkt-droids-projects.vercel.app`)，这类域名默认开启
   Vercel Deployment Protection（SSO 墙），**外部用户/App 内嵌 WebView 完全打不开**。
   **永远使用固定别名 `https://project-4v5mr.vercel.app`**（每次部署会自动更新指向最新
   production 部署，不会失效），不要把随机域名写进 capacitor.config.ts / Supabase Auth
   URL Configuration / 任何文档里。
2. Supabase 免费项目长期不活跃可能被暂停继而清除，DNS 会变成 NXDOMAIN（不是网络问题，
   是项目真的没了）。如果任何 Supabase 请求突然全部失败，先用
   `nslookup <project-ref>.supabase.co 1.1.1.1` 排查域名是否还存在。
3. 数据获取类 hook 的 `fetchXxx` 函数必须包 try/catch/finally，否则网络层面的 reject
   （不是 Supabase 返回的 `{error}` 字段，是 fetch 真的抛异常）会导致 `isLoading` 永远
   卡 `true`，页面无限骨架屏且控制台无明显报错。已在 6 个 hook + AuthProvider 修复过，
   新增 hook 时照此模式写。

---

## 七、线上地址 & 环境变量

```
Vercel (固定别名, 务必使用):  https://project-4v5mr.vercel.app
GitHub:  github.com/wjdr9w2vkt-droid/petmate-ai
Supabase: ugdwvaoctafwpgqgzlte.supabase.co (2026-07 因原项目被清除而重建，
          原项目 cjlwrsmzqmbcnernmkkv 已不存在，历史记录中出现的都是旧值)

NEXT_PUBLIC_SUPABASE_URL=https://ugdwvaoctafwpgqgzlte.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_wuKop67tytmdPRYAlM3mwg_ZilL4Hpf
# service_role key 见 .env.local（不进 git）
# AI Key: 用户在 /profile 自行配置, localStorage 存储
```

---

## 八、常用命令

```bash
npm run dev          # :3000
npm run build        # 生产构建
vercel --prod        # 部署
npx cap sync ios     # 同步 iOS
npx cap open ios     # Xcode
```

---

## 九、参考文档

`docs/APP_STORE_PUBLISHING_KNOWLEDGE_BASE.md` — App Store 发布实战知识库
`docs/RELEASE_READY_REPORT.md` — v2.0 发布就绪报告
`docs/design.md` / `docs/component-library.md` — 设计系统
