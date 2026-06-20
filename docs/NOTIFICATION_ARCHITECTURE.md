# PetMate Push Notification 架构

---

## 一、整体架构

```
┌──────────────────────────────────────────────┐
│              通知来源                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐   │
│  │疫苗  │ │驱虫  │ │生日  │ │自定义提醒  │   │
│  └──┬───┘ └──┬───┘ └──┬───┘ └────┬─────┘   │
└─────┼────────┼────────┼──────────┼───────────┘
      │        │        │          │
      ▼        ▼        ▼          ▼
┌──────────────────────────────────────────────┐
│          Notification Engine                  │
│  ┌──────────────────────────────────────┐   │
│  │  读取 reminders 表                    │   │
│  │  检查 due_date + notify_before        │   │
│  │  生成通知 payload                     │   │
│  └──────────────────────────────────────┘   │
└────────────────────┬─────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌───────────┐ ┌──────────┐ ┌──────────┐
│ PWA Web   │ │   APNs   │ │  Firebase│
│ Push API  │ │  (iOS)   │ │  (备选) │
└───────────┘ └──────────┘ └──────────┘
```

## 二、数据模型扩展

```sql
-- 通知日志表
CREATE TABLE notification_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id),
  reminder_id  UUID REFERENCES reminders(id),
  type         VARCHAR(20) NOT NULL,
  title        VARCHAR(200) NOT NULL,
  body         TEXT,
  sent_at      TIMESTAMPTZ DEFAULT now(),
  is_read      BOOLEAN DEFAULT false
);

-- 设备 Token 表
CREATE TABLE device_tokens (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id),
  platform     VARCHAR(10) NOT NULL, -- 'ios' | 'web'
  token        TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, token)
);
```

## 三、通知类型

| 类型 | 触发时间 | 标题模板 |
|------|----------|----------|
| 💉 疫苗 | 到期前 1/3/7 天 | "{pet_name} 的 {vaccine_name} 即将到期" |
| 🪱 驱虫 | 到期当天 | "该给 {pet_name} 驱虫了" |
| 🛁 美容 | 到期前 1 天 | "{pet_name} 预约美容提醒" |
| 🏥 体检 | 到期前 3 天 | "{pet_name} 年度体检时间" |
| 🎂 生日 | 当天 9:00 | "🎂 {pet_name} 今天 {age}岁啦！" |
| 🏠 纪念日 | 当天 9:00 | "🏠 {pet_name} 到家 {years}周年" |
| ⭐ 自定义 | 到期前 N 天 | 用户自定义标题 |

## 四、PWA 通知实现

```typescript
// 请求权限
const permission = await Notification.requestPermission()

// 发送本地通知
if (permission === 'granted') {
  new Notification('🐾 PetMate', {
    body: '该给豆豆驱虫了',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    tag: 'reminder-123',
  })
}
```

## 五、APNs 通知（Capacitor 阶段）

```typescript
import { LocalNotifications } from '@capacitor/local-notifications'

await LocalNotifications.schedule({
  notifications: [{
    id: 1,
    title: '🐾 PetMate',
    body: '该给豆豆驱虫了',
    schedule: { at: new Date('2026-06-25T09:00:00') },
  }],
})
```

## 六、通知中心 UI

```
┌─────────────────────────────────────────┐
│  🔔 消息中心                             │
├─────────────────────────────────────────┤
│  ● 未读                                  │
│  ┌─────────────────────────────────┐   │
│  │ 💉 狂犬疫苗明天到期              │   │
│  │    豆豆 · 2小时前               │   │
│  └─────────────────────────────────┘   │
│  ○ 已读                                  │
│  ┌─────────────────────────────────┐   │
│  │ 🎂 豆豆生日快乐！               │   │
│  │    3天前                        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 七、实施路线

```
Phase 1 (当前): PWA Web Notification
  → 浏览器权限请求
  → 基于 reminders 表的本地通知
  → 工作量：1天

Phase 2 (Capacitor 阶段): iOS 原生通知
  → @capacitor/local-notifications
  → 系统级通知，后台也可触发
  → 工作量：0.5天

Phase 3 (未来): 远程推送
  → Supabase Edge Function 定时检查
  → APNs 推送
  → 工作量：3天
```

> **当前建议**：Phase 1 即可满足基本需求。Phase 2-3 在 Capacitor 接入后实施。
