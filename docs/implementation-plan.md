# PetMate 产品升级 — 详细开发实施计划

> 版本：v2.0 升级周期
> 原则：增量交付，每 Sprint 有可感知的用户价值。

---

## 总览

```
Sprint 8:  UI 渗透 + 细节打磨     3天
Sprint 9:  成长时间轴             5天
Sprint 10: 提醒中心               4天
Sprint 11: 纪念相册               4天
Sprint 12: iPhone 适配 + 收尾     3天
─────────────────────────────────────
合计: 19天
```

---

## Sprint 8: UI 全面渗透 + 细节打磨

### 目标

设计系统从 CSS 变量渗透到每一个页面组件。

### 任务

| # | 任务 | 预估 |
|---|------|------|
| 8.1 | Button 全局替换为 `btn-primary` / `btn-secondary` | 1h |
| 8.2 | Card 统一样式 `card-pet` | 1h |
| 8.3 | Input 统一样式 `input-pet` | 0.5h |
| 8.4 | Badge 统一为暖色调 | 0.5h |
| 8.5 | Tab 组件暖色重设计 | 1h |
| 8.6 | BottomNav 图标 + 动效打磨 | 1h |
| 8.7 | Toast 圆角 + 暖色 | 0.5h |
| 8.8 | EmptyState 统一插画风格 | 1h |
| 8.9 | Skeleton 暖色适配 | 0.5h |
| 8.10 | 页面过渡动画（fadeInUp） | 1h |
| 8.11 | 全局滚动条样式 | 0.5h |
| 8.12 | 暗色模式完整适配 | 2h |
| 8.13 | 测试 + 构建 + 部署 | 2h |

### 验收

- 所有页面色彩一致，无灰色残留
- 所有圆角 ≥ 0.75rem
- 动效流畅自然
- 暗色模式可用

---

## Sprint 9: 宠物成长时间轴

### 目标

为每只宠物建立可视化成长时间轴。

### 任务

| # | 任务 | 预估 |
|---|------|------|
| 9.1 | `timeline_events` 表创建 + Migration | 1h |
| 9.2 | RLS Policy + 索引 | 0.5h |
| 9.3 | API Route: GET/POST timeline_events | 2h |
| 9.4 | `use-timeline.ts` Hook | 1.5h |
| 9.5 | TimelineCard 组件 | 2h |
| 9.6 | TimelineList 组件（虚拟滚动） | 2h |
| 9.7 | 自动同步：pets创建→到家事件 | 1h |
| 9.8 | 自动同步：vaccinations→疫苗事件 | 1h |
| 9.9 | 自动同步：growth_records→体重事件 | 1h |
| 9.10 | 年份/月份导航 | 1.5h |
| 9.11 | FAB 添加事件按钮 | 1h |
| 9.12 | TimelineForm 组件 | 2h |
| 9.13 | `/pets/[id]/timeline` 页面 | 2h |
| 9.14 | PetDetail 页时间轴入口 | 0.5h |
| 9.15 | 测试 + 构建 + 部署 | 2h |

### 验收

- 每只宠物拥有独立时间轴
- 滚动流畅，年份切换正常
- 到家日自动生成
- 疫苗/体重自动同步
- 照片附件正常

---

## Sprint 10: 提醒中心 + Apple Calendar

### 目标

建立主动提醒系统，支持 ICS 导出。

### 任务

| # | 任务 | 预估 |
|---|------|------|
| 10.1 | `reminders` 表创建 + Migration | 1h |
| 10.2 | RLS Policy + 索引 | 0.5h |
| 10.3 | API Route: CRUD reminders | 2h |
| 10.4 | `use-reminders.ts` Hook | 1.5h |
| 10.5 | ReminderCard 组件（含倒计时） | 2h |
| 10.6 | ReminderList 组件（即将到来 / 已完成） | 1.5h |
| 10.7 | ReminderForm 组件 | 2h |
| 10.8 | 自动生成：生日提醒 | 0.5h |
| 10.9 | 自动生成：疫苗到期提醒 | 0.5h |
| 10.10 | 自动生成：到家纪念日 | 0.5h |
| 10.11 | ICS 文件导出功能 | 1.5h |
| 10.12 | "添加到 Apple 日历" 按钮 | 0.5h |
| 10.13 | `/reminders` 页面 | 1.5h |
| 10.14 | BottomNav 添加入口 | 0.5h |
| 10.15 | 测试 + 构建 + 部署 | 2h |

### 验收

- 提醒列表分组展示
- 新建提醒正常
- 自动提醒生成正确
- ICS 下载可用
- Apple Calendar 按钮显示

---

## Sprint 11: 宠物纪念相册

### 目标

让照片有归属，让回忆可浏览。

### 任务

| # | 任务 | 预估 |
|---|------|------|
| 11.1 | `pet_photos` VIEW 创建 | 0.5h |
| 11.2 | API Route: GET photos（分页） | 1h |
| 11.3 | `use-photos.ts` Hook | 1h |
| 11.4 | PhotoGrid 瀑布流组件 | 3h |
| 11.5 | PhotoViewer 全屏组件（swipe） | 2h |
| 11.6 | PhotoTimeline 时间轴相册 | 2h |
| 11.7 | YearReview 年度回顾组件 | 2h |
| 11.8 | `/pets/[id]/photos` 页面 | 2h |
| 11.9 | PetDetail 页相册入口 | 0.5h |
| 11.10 | 测试 + 构建 + 部署 | 2h |

### 验收

- 多来源照片聚合展示
- 瀑布流/时间轴/年度三种视图
- 全屏浏览 + swipe 手势
- 年度回顾数据正确

---

## Sprint 12: iPhone 适配 + 最终收尾

### 目标

iPhone 体验打磨，PWA 增强，全链路测试。

### 任务

| # | 任务 | 预估 |
|---|------|------|
| 12.1 | 安全区全面适配（横屏+竖屏） | 1h |
| 12.2 | 触控区域检查（≥44pt） | 1h |
| 12.3 | Splash Screen 多设备尺寸 | 1h |
| 12.4 | 字体 SF Pro 优先 | 0.5h |
| 12.5 | PWA 缓存策略优化 | 1h |
| 12.6 | 全页面响应式复查 | 2h |
| 12.7 | iPhone 15/16 真机测试 | 2h |
| 12.8 | E2E 全流程走查 | 2h |
| 12.9 | 文档最终更新 | 1h |
| 12.10 | 最终构建 + 部署 | 1h |

### 验收

- iPhone 所有页面完整可用
- PWA 安装后全屏运行正常
- 所有已知 Bug 修复
- 文档完整

---

## 数据库变更汇总

### 新增表

```sql
-- Sprint 9
CREATE TABLE timeline_events ( ... );

-- Sprint 10
CREATE TABLE reminders ( ... );
```

### 新增视图

```sql
-- Sprint 11
CREATE VIEW pet_photos AS ...;
```

### 新增 RLS Policy

```
timeline_events: SELECT/INSERT/UPDATE/DELETE (级联 pet_id)
reminders:       SELECT/INSERT/UPDATE/DELETE (级联 pet_id)
```

---

## 路由新增

| Sprint | 路由 | 页面 |
|--------|------|------|
| 9 | `/pets/[id]/timeline` | 成长时间轴 |
| 9 | `/pets/[id]/timeline/new` | 添加事件 |
| 10 | `/reminders` | 提醒列表 |
| 10 | `/reminders/new` | 新建提醒 |
| 11 | `/pets/[id]/photos` | 纪念相册 |
| 11 | `/pets/[id]/photos/timeline` | 时间轴相册 |

---

## 风险与应对

| 风险 | 应对 |
|------|------|
| 照片量大导致瀑布流性能 | 分页加载 + 缩略图 + 虚拟滚动 |
| 时间轴数据量大 | 虚拟滚动 + 年份分段加载 |
| ICS 兼容性 | 仅支持 Apple Calendar 标准格式 |
| iPhone 设备碎片化 | 专注 iPhone 15/16 系列 |

---

## 里程碑

```
Week 1: Sprint 8-9
  → UI 全面渗透 + 成长时间轴上线

Week 2: Sprint 10-11
  → 提醒中心 + 纪念相册上线

Week 3: Sprint 12
  → iPhone 适配 + 最终发布
```
