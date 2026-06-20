# PetMate Component Library v2.0

> 所有组件遵循设计系统，统一样式规范。

---

## Button

```
┌──────────────────────────────────────────────┐
│  变体       背景              文字色         │
│  ─────────────────────────────────────────  │
│  primary    primary-500       white          │
│  secondary  primary-100       primary-700    │
│  ghost      transparent       text-secondary │
│  danger     danger/10         danger         │
│  outline    transparent       primary-500    │
└──────────────────────────────────────────────┘
```

**规格**

```
圆角:    rounded-xl (0.75rem)
高度:    h-10 (40px)
内边距:  px-5 py-2
字重:    font-medium
过渡:    150ms ease-smooth
悬停:    亮度降低 8%
按下:    scale(0.97)
焦点:    ring-2 ring-primary-200
```

**CSS 类**

```
btn-primary:   bg-[#F4853A] text-white hover:bg-[#D4682A] rounded-xl
btn-secondary: bg-[#FFECD5] text-[#A84D1E] hover:bg-[#FFD9B0] rounded-xl
btn-ghost:     text-[#9B8575] hover:bg-[#FFF8F0] rounded-xl
btn-danger:    bg-red-50 text-[#E87060] hover:bg-red-100 rounded-xl
```

---

## Card

```
┌──────────────────────────────────────────────┐
│  Card                                       │
│  背景:    white                             │
│  圆角:    rounded-2xl (1rem)                │
│  内边距:  p-5 (1.25rem)                     │
│  边框:    border border-[#F0E6DC]           │
│  阴影:    shadow-sm                          │
│  悬停:    shadow-md + translateY(-2px)       │
└──────────────────────────────────────────────┘
```

**变体**

```
default:  white bg + border
highlight: primary-50 bg + primary-200 border (宠物卡片)
subtle:   bg-[#FDF9F5] + no border (区块容器)
```

---

## Input

```
┌──────────────────────────────────────────────┐
│  背景:    white                             │
│  圆角:    rounded-xl (0.75rem)              │
│  高度:    h-10 (40px)                       │
│  内边距:  px-4 py-2                          │
│  边框:    border border-[#F0E6DC]           │
│  焦点:    border-primary-400 ring-2         │
│           ring-primary-200/50               │
│  文字:    text-[#4A3728] text-sm            │
│  占位符:  text-[#C4B5A5]                    │
└──────────────────────────────────────────────┘
```

---

## Avatar

```
┌──────────────────────────────────────────────┐
│  形状:     rounded-full (圆形)               │
│  默认:     暖灰色底 + 首字母                  │
│  边框:     2px white + shadow-sm             │
│                                           │
│  尺寸:                                     │
│  sm:   h-8 w-8   (32px)                    │
│  md:   h-12 w-12 (48px)  ← 默认            │
│  lg:   h-20 w-20 (80px)                    │
│  xl:   h-28 w-28 (112px)                   │
└──────────────────────────────────────────────┘
```

---

## Badge

```
┌──────────────────────────────────────────────┐
│  圆角:    rounded-full (胶囊)                │
│  内边距:  px-2.5 py-0.5                     │
│  字号:    text-xs font-medium                │
│                                           │
│  变体:                                     │
│  success: bg-[#E8F2EB] text-[#5CA06A]       │
│  warning: bg-[#FFF5F2] text-[#F0A050]       │
│  danger:  bg-red-50 text-[#E87060]          │
│  info:    bg-[#E8F0F7] text-[#5C8DB8]       │
│  neutral: bg-[#F0E6DC] text-[#9B8575]       │
└──────────────────────────────────────────────┘
```

---

## Dialog/Modal

```
┌──────────────────────────────────────────────┐
│  背景:    white                             │
│  圆角:    rounded-2xl (1rem)                │
│  阴影:    shadow-xl                          │
│  内边距:  p-6                                │
│  遮罩:    bg-[#4A3728]/20 backdrop-blur-sm  │
│                                           │
│  动画:    scale(0.95→1) + opacity(0→1)      │
│          duration-spring 300ms               │
└──────────────────────────────────────────────┘
```

---

## Tab

```
┌──────────────────────────────────────────────┐
│  容器:     bg-[#FDF9F5] rounded-xl p-1      │
│  标签:     rounded-lg px-4 py-2 text-sm      │
│  默认:     text-[#9B8575]                   │
│  选中:     bg-white text-[#F4853A] shadow-sm│
│  过渡:     200ms ease-smooth                │
└──────────────────────────────────────────────┘
```

---

## Navigation

### Header (顶部导航)

```
高度:      3.5rem (56px) + safe-area-inset-top
背景:      white/95 + backdrop-blur
边框:      底部 1px border-[#F0E6DC]
Logo:      18px font-semibold text-[#4A3728]
导航链接:  14px text-[#9B8575] hover:text-[#4A3728]
Avatar:    8×8 (32px) 圆形，链接到/profile
```

### BottomNav (底部导航)

```
高度:      4rem (64px) + safe-area-inset-bottom
背景:      white/95 + backdrop-blur
边框:      顶部 1px border-[#F0E6DC]
图标:      20px，text-[#9B8575]
选中态:    text-[#F4853A] font-medium
标签:      11px
桌面端:    md:hidden
```

---

## Toast (通知)

```
位置:      top-center
风格:      richColors
圆角:      rounded-xl
阴影:      shadow-lg
动画:      300ms ease-spring 弹入
```

---

## Skeleton (骨架屏)

```
圆角:      rounded-lg
动画:      pulse (柔和呼吸，非闪烁)
颜色:      bg-[#F0E6DC]
```

---

## EmptyState

```
容器:      flex flex-col items-center py-16
图标:      5rem (80px) 插画或 emoji
标题:      18px font-semibold text-[#4A3728]
描述:      14px text-[#9B8575] max-w-sm
按钮:      mt-6 btn-primary
```

---

## 间距层级

```
页面容器:    max-w-2xl mx-auto px-4
区块间距:     space-y-6 (1.5rem)
卡片间距:     space-y-3 (0.75rem)
表单字段间距: space-y-4 (1rem)
表单标签:     text-sm font-medium mb-1.5
```

---

## 微交互规范

```
所有可交互元素:
  - hover: 150ms 颜色/阴影过渡
  - active: scale(0.97)
  - focus-visible: ring-2 ring-primary-200

链接:
  - 默认: text-primary-500
  - hover: underline + brightness(0.9)

卡片:
  - hover: shadow-md + translateY(-2px)
  - transition: 200ms ease-smooth
```
