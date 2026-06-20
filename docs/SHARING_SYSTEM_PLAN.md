# PetMate 轻量级分享功能方案

> 不是社交系统。只是让用户把宠物的可爱分享出去。

---

## 一、分享场景

```
🎯 成长卡片分享
   → 时间轴事件 + 照片 → 精美卡片 → 微信/小红书

🎯 相册分享
   → 多张照片拼图 → 分享

🎯 年度回顾分享
   → 统计数据 + 最佳照片 → 年度卡片

🎯 纪念日分享
   → 到家纪念 / 生日 → 纪念卡片
```

## 二、卡片设计

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │        [宠物照片]            │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  ⚖️ 豆豆 · 体重里程碑               │
│                                     │
│  突破 30kg 啦！                      │
│  从 8kg 的小金毛长到 30kg，         │
│  每一天都在健康长大 🧡               │
│                                     │
│  2026年6月19日                       │
│                                     │
│  ───────────────────────────────    │
│  🐾 PetMate AI                      │
│  记录每一刻，陪伴每一天              │
└─────────────────────────────────────┘
```

## 三、技术方案

### 卡片生成

```typescript
// 使用 html2canvas 或 DOM → Canvas
import html2canvas from 'html2canvas'

async function generateShareCard(element: HTMLElement) {
  const canvas = await html2canvas(element)
  return canvas.toDataURL('image/png')
}
```

### Web Share API

```typescript
// 优先使用原生分享
if (navigator.share) {
  await navigator.share({
    title: '豆豆的体重里程碑',
    text: '突破30kg啦！',
    url: 'https://petmate.app/share/abc',
  })
} else {
  // 降级：复制链接 + 保存图片
  downloadImage(cardImage)
}
```

### 分享尺寸

```
微信朋友圈:  1080×1080 (1:1)
小红书:      1080×1440 (3:4)
X/Twitter:   1200×675  (16:9)
Instagram:   1080×1080 (1:1) Story 1080×1920
```

## 四、分享入口

```
时间轴卡片    → ⬆️ 分享按钮 → 生成卡片 → 分享
相册全屏浏览  → ⬆️ 分享按钮 → 当前照片 → 分享
宠物详情页    → ⬆️ 分享按钮 → 宠物档案卡 → 分享
年度回顾      → ⬆️ 分享按钮 → 年度卡片 → 分享
```

## 五、实施路线

```
Phase 1 (轻量):  Web Share API + 图片下载
  → 工作量：1天

Phase 2 (增强):  html2canvas 卡片生成
  → 工作量：1.5天

Phase 3 (Capacitor):  原生 Share Sheet
  → @capacitor/share
  → 工作量：0.5天
```

## 六、功能边界

```
✅ 做:
   ✅ 卡片生成 + 图片下载
   ✅ Web Share API 分享
   ✅ 多平台尺寸适配

❌ 不做:
   ❌ 关注/粉丝系统
   ❌ 评论/点赞
   ❌ 分享统计/排行
   ❌ 社区功能
```

> 分享是为了让用户为自己的宠物自豪。不是为了刷数据。
