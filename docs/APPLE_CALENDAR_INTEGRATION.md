# PetMate Apple Calendar 集成方案

---

## 一、当前状态

```
✅ ICS 文件导出（已实现）
   → 提醒卡片点 📅 → 下载 .ics → 系统日历导入

⬜ EventKit 原生写入（Capacitor 阶段）
⬜ 自动同步提醒→日历
⬜ 双向同步
```

## 二、ICS 导出（已实现）

### 文件格式

```typescript
function generateICS(reminder, petName) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:🐾 ${reminder.title} - ${petName}`,
    `DESCRIPTION:${reminder.description}`,
    `DTSTART:${formatDate(reminder.dueDate)}`,
    `DTEND:${formatDate(reminder.dueDate + 1h)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

// 下载触发
const blob = new Blob([ics], { type: 'text/calendar' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url; a.download = `petmate-${title}.ics`
a.click()
```

### 用户体验

```
┌──────────────────────────────┐
│  💉 狂犬疫苗  3天后          │
│  豆豆 · 2026-06-22      [📅]│  ← 点击
└──────────────────────────────┘
         │
         ▼
   下载 .ics 文件
         │
         ▼
   系统自动打开"日历"
         │
         ▼
   用户确认 → 添加到 Apple Calendar
```

## 三、EventKit 原生集成（Capacitor）

### 插件

```bash
npm install @capacitor-community/calendar
```

### API

```typescript
import { Calendar } from '@capacitor-community/calendar'

// 请求权限
await Calendar.requestPermission()

// 创建事件
await Calendar.createEvent({
  title: '🐾 狂犬疫苗 - 豆豆',
  notes: 'PetMate 提醒：狂犬疫苗接种',
  startDate: new Date('2026-06-22T09:00:00').getTime(),
  endDate: new Date('2026-06-22T09:30:00').getTime(),
  location: '',
})
```

### UI

```
当前（ICS）:
  [📅] → 下载 .ics → 用户手动导入

未来（EventKit）:
  [📅] → 一键写入 → 完成 ✓
```

## 四、日历事件类型

| 提醒类型 | 日历标题 | 时长 | 提前提醒 |
|----------|----------|------|----------|
| 疫苗 | 🐾 {vaccine_name} - {pet_name} | 30min | 1天前 |
| 驱虫 | 🐾 驱虫日 - {pet_name} | 15min | 当天 |
| 体检 | 🐾 年度体检 - {pet_name} | 1h | 3天前 |
| 生日 | 🎂 {pet_name} {age}岁生日 | 全天 | 1周前 |
| 纪念日 | 🏠 {pet_name} 到家{n}周年 | 全天 | 1周前 |

## 五、实施路线

```
当前:          ICS 导出 ✅
Capacitor 阶段: EventKit 一键写入
                工作量：0.5天
```
