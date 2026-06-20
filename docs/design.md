# PetMate Design System v2.0

> 设计理念：温暖、柔软、治愈 — 像午后阳光下的宠物咖啡馆。

---

## Color Palette

### 主色调 — 奶油暖橘

```
┌─────────────────────────────────────────────────────┐
│  Primary                                           │
│  ────────                                          │
│  50   #FFF8F0  品牌浅底                              │
│  100  #FFECD5  卡片底色                              │
│  200  #FFD9B0  悬停态                                │
│  300  #FFC080  边框强调                              │
│  400  #FFA040  次要按钮                              │
│  500  #F4853A  主按钮 / 强调色                        │
│  600  #D4682A  按钮悬停                              │
│  700  #A84D1E  深色文字                              │
└─────────────────────────────────────────────────────┘
```

### 辅助色

```
┌─────────────────────────────────────────────────────┐
│  Warm               Mint              Sky           │
│  ────               ────              ───           │
│  50 #FFF5F2         #F5FAF7           #F5F8FB       │
│  100 #FFE8E0        #E8F2EB           #E8F0F7       │
│  200 #FECDC5        #C5E0CC           #C5D8EC       │
│  400 #F4857A        #7ABF8A           #7AADDB       │
│  500 #E86A5C        #5CA06A           #5C8DB8       │
└─────────────────────────────────────────────────────┘
```

### 语义色

```
Success: #6BAF7B (柔和绿，非荧光绿)
Warning: #F0A050 (暖琥珀)
Danger:  #E87060 (暖珊瑚红，非刺眼红)
Info:    #7AADDB (柔和蓝)
```

### 中性色

```
页面背景: #FDF9F5 (暖奶油白)
卡片背景: #FFFFFF
边框:     #F0E6DC (暖灰米色)
文字主:   #4A3728 (暖深棕，非纯黑)
文字次:   #9B8575 (暖灰棕)
文字弱:   #C4B5A5 (浅米棕)
```

### CSS 变量

```css
:root {
  /* Primary */
  --color-primary-50:  #FFF8F0;
  --color-primary-100: #FFECD5;
  --color-primary-200: #FFD9B0;
  --color-primary-300: #FFC080;
  --color-primary-400: #FFA040;
  --color-primary-500: #F4853A;
  --color-primary-600: #D4682A;
  --color-primary-700: #A84D1E;

  /* Semantic */
  --color-success: #6BAF7B;
  --color-warning: #F0A050;
  --color-danger:  #E87060;
  --color-info:    #7AADDB;

  /* Neutral */
  --color-bg:      #FDF9F5;
  --color-surface: #FFFFFF;
  --color-border:  #F0E6DC;
  --color-text:    #4A3728;
  --color-text-secondary: #9B8575;
  --color-text-muted:     #C4B5A5;
}
```

---

## Typography

### 字体

```
Heading:  system-ui, -apple-system, sans-serif (系统圆体优先)
Body:     system-ui, -apple-system, sans-serif
Mono:     monospace (仅用于数据/数字)
```

### 字号层级

```
Display:  2.5rem / 3rem   — 仅首页大标题
H1:       2rem   / 2.5rem — 页面主标题
H2:       1.5rem / 2rem   — 区块标题
H3:       1.25rem/ 1.75rem— 卡片标题
Body:     1rem   / 1.5rem — 正文
Body-sm:  0.875rem/1.25rem— 辅助文字
Caption:  0.75rem/1rem    — 标签/说明
```

### 字重

```
Bold:    600  — 标题/强调
Medium:  500  — 副标题/按钮
Regular: 400  — 正文
```

---

## Spacing

```
单位: 0.25rem (4px)

xs:   0.25rem  (4px)   — 紧密关联元素
sm:   0.5rem   (8px)   — 图标与文字
md:   0.75rem  (12px)  — 列表项间距
base: 1rem     (16px)  — 标准内边距
lg:   1.25rem  (20px)  — 卡片内边距
xl:   1.5rem   (24px)  — 区块间距
2xl:  2rem     (32px)  — 页面区块间距
3xl:  2.5rem   (40px)  — 大区块间距
```

---

## Radius (圆角)

```
sm:    0.5rem   (8px)   — 标签/徽章/小按钮
md:    0.75rem  (12px)  — 按钮/输入框/卡片
lg:    1rem     (16px)  — 大卡片/Modal
xl:    1.25rem  (20px)  — 头像/大组件
full:  9999px           — 胶囊/药丸形状
```

---

## Shadow (阴影)

```css
/* 无攻击性的柔和阴影 */
--shadow-xs:   0 1px 2px  rgba(74,55,40,0.04);
--shadow-sm:   0 2px 8px  rgba(74,55,40,0.06);
--shadow-md:   0 4px 16px rgba(74,55,40,0.08);
--shadow-lg:   0 8px 32px rgba(74,55,40,0.10);
--shadow-xl:   0 16px 48px rgba(74,55,40,0.12);

/* 所有阴影使用暖棕色，非纯黑 */
```

---

## Motion (动效)

```css
/* 原则：柔和、不突兀、有呼吸感 */

--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-smooth:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55);

--duration-fast:    150ms;  /* 微交互 */
--duration-base:    250ms;  /* 标准过渡 */
--duration-slow:    400ms;  /* 页面过渡 */
--duration-spring:  500ms;  /* 弹性动画 */
```

### 动画规范

```
Hover:        150ms ease-smooth 轻微放大(1.02)或颜色过渡
Focus:        0 0 0 3px var(--color-primary-200) 柔光
Press:        150ms 缩放至0.97
Page enter:   400ms ease-smooth fadeIn + slideUp(8px)
Card enter:   300ms ease-spring 依次入场(stagger 50ms)
Toast:        300ms ease-spring 从上方弹入
Modal:        250ms ease-smooth 缩放+淡入
```

---

## Icon Style

```
Icon Library: lucide-react
风格:         线性图标，圆角端点
尺寸:         基础 1.25rem (20px)，小号 1rem (16px)
线宽:         strokeWidth={1.5} (更柔和)
颜色:         跟随文字色，强调色用于选中态
```

---

## Illustration Style

```
原则: 宠物照片 > 插图 > 文字 > 装饰

插图风格:
- 手绘感、不完全对称
- 圆润线条
- 暖色调
- 不追求写实，追求可爱

使用场景:
- 空状态
- 加载失败
- 欢迎页
- 引导提示
```

---

## 设计原则卡片

```
┌────────────────────────────────────────┐
│                                        │
│   🐾  PetMate Design Principles       │
│                                        │
│   1. 宠物优先 — 界面让位于内容          │
│   2. 温暖至上 — 每个像素都有温度         │
│   3. 呼吸感   — 留白是设计的一部分      │
│   4. 圆润友好 — 没有尖锐的角            │
│   5. 信任传递 — 清晰不隐藏             │
│   6. 轻量治愈 — 不制造焦虑和压力        │
│                                        │
└────────────────────────────────────────┘
```
