# 提醒中心 + Apple Calendar — 设计方案

> 不是闹钟。是关心宠物的温柔提醒。

---

## 一、提醒类型

```
┌────────────────────────────────────────────────────┐
│  类型          触发方式        频次      Calendar  │
│  ──────────────────────────────────────────────── │
│  💉 疫苗       自动（从vaccinations读取） 一次    │
│  🪱 驱虫       用户创建         重复（月/季）      │
│  🛁 洗澡/美容  用户创建         重复（周/月）      │
│  🏥 体检       用户创建         重复（半年/年）    │
│  🎂 生日       自动（从pets.birthday） 每年       │
│  🏠 到家纪念日  自动（从pets.created_at） 每年    │
│  ⭐ 自定义      用户创建         可配置            │
│  ⚖️ 体重检查    用户创建         重复（周/月）     │
└────────────────────────────────────────────────────┘
```

---

## 二、数据模型

```sql
CREATE TABLE reminders (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id        UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  type          VARCHAR(20) NOT NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  due_date      DATE NOT NULL,
  repeat_type   VARCHAR(10),           -- 'none'|'weekly'|'monthly'|'quarterly'|'yearly'
  is_completed  BOOLEAN DEFAULT false,
  completed_at  TIMESTAMPTZ,
  notify_before INTEGER DEFAULT 1,     -- 提前几天提醒
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

---

## 三、提醒列表 UI

```
┌─────────────────────────────────────────┐
│  🔔 提醒中心                             │
├─────────────────────────────────────────┤
│                                         │
│  📋 即将到来                             │
│  ┌─────────────────────────────────┐   │
│  │ 🔴 狂犬疫苗到期          3天后  │   │
│  │    豆豆 · 2026-06-22           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 🟡 每月驱虫              12天后  │   │
│  │    豆豆 · 重复：每月1次         │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 🟢 豆豆生日              30天后  │   │
│  │    每年 · 2027-03-15             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ✅ 已完成                               │
│  ┌─────────────────────────────────┐   │
│  │ ✓ 春季体检                    │   │
│  │   已完成于 2026-04-01           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────┐        │
│  │      + 新建提醒             │        │
│  └────────────────────────────┘        │
└─────────────────────────────────────────┘
```

---

## 四、Apple Calendar 预留

### 设计原则

```
当前阶段:    预留接口 + ICS导出
未来阶段:    EventKit 原生集成（Capacitor打包后）
```

### ICS 文件导出

```typescript
// lib/calendar/ics.ts
export function generateICS(event: {
  title: string
  description: string
  startDate: Date
  endDate: Date
  petName: string
}): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:🐾 ${event.title} - ${event.petName}`,
    `DESCRIPTION:${event.description}`,
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(event.endDate)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
```

### UI 集成

```
每个提醒卡片右下角：

  ┌──────────────────────────┐
  │  💉 狂犬疫苗     3天后   │
  │  豆豆 · 2026-06-22       │
  │                    [📅]  │  ← 点击 → 下载ICS → 打开日历
  └──────────────────────────┘
```

### 预留接口

```typescript
// 未来 Capacitor EventKit 集成预留
interface CalendarEvent {
  id: string
  title: string
  notes: string
  startDate: number    // timestamp
  endDate: number
  petName: string
  petAvatarUrl?: string
}

// 预留方法签名
async function addToAppleCalendar(event: CalendarEvent): Promise<void>
async function syncAllReminders(petId: string): Promise<void>
```

---

## 五、路由

```
/reminders                → 提醒列表
/reminders/new            → 新建提醒
/reminders/[id]           → 提醒详情
```

---

## 六、实施预估

| 项目 | 内容 | 预估 |
|------|------|------|
| R1 | reminders 表 + API + RLS | 1.5天 |
| R2 | 提醒列表 UI + 新建表单 | 2天 |
| R3 | ICS 导出功能 | 0.5天 |
| R4 | 自动从疫苗/生日生成提醒 | 1天 |
| **合计** | | **5天** |
