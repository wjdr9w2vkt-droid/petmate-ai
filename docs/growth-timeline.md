# 宠物成长时间轴 — 功能设计方案

> PetMate 情感核心模块。让主人看见宠物成长的每一步。

---

## 一、功能定位

不是冷冰冰的记录列表。

是：

一本成长日记。

一条时间河流。

一段陪伴的视觉叙事。

---

## 二、用户故事

```
小明的金毛豆豆到家已经一年了。
他打开 PetMate，滑过时间轴：

2025.6.20  🏠 豆豆到家！3个月大的小金毛
2025.7.15  💉 第一次疫苗
2025.9.01  ⚖️ 体重突破10kg
2025.10.1  🛁 第一次洗澡吹毛很乖
2026.1.01  🎂 豆豆一岁啦
2026.3.15  🏥 绝育手术顺利完成
2026.6.19  📸 夏天到了，换了新发型

每一段都是回忆。
每一段都值得保存。
```

---

## 三、数据模型（扩展现有表）

### growth_records 增强

```sql
-- 在现有 growth_records 表基础上增加
ALTER TABLE growth_records ADD COLUMN event_type VARCHAR(20);
-- event_type: 'weight' | 'vaccine' | 'grooming' | 'medical'
--             | 'training' | 'milestone' | 'photo' | 'other'
```

### 新增 timeline_events 表

```sql
CREATE TABLE timeline_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id      UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type  VARCHAR(30) NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  photo_urls  TEXT[],                    -- PostgreSQL 数组，支持多图
  event_date  DATE NOT NULL,
  is_milestone BOOLEAN DEFAULT false,   -- 重要里程碑标记
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 四、事件类型定义

```typescript
type EventType =
  | 'arrived_home'    // 🏠 到家
  | 'birthday'        // 🎂 生日
  | 'vaccine'         // 💉 疫苗
  | 'deworming'       // 🪱 驱虫
  | 'grooming'        // ✂️ 美容
  | 'weight'          // ⚖️ 体重里程碑
  | 'medical'         // 🏥 医疗
  | 'training'        // 🎯 训练成就
  | 'milestone'       // ⭐ 重要时刻
  | 'photo'           // 📸 照片
  | 'note'            // 📝 笔记
```

### 每个类型的展示

```
🏠 到家日:
   icon: 🏠
   color: warm pink
   title: "豆豆到家了！"
   desc: 3个月大的小金毛，第一次见面就摇尾巴

🎂 生日:
   icon: 🎂
   color: celebration gold
   title: "豆豆 {age}岁啦！"
   desc: 今天给豆豆准备了牛肉蛋糕

💉 疫苗:
   icon: 💉
   color: soft blue
   title: "{疫苗名称}接种"
   desc: 下次接种：{date}

⚖️ 体重里程碑:
   icon: ⚖️
   color: mint green
   desc: 突破{weight}kg！健康长大中
```

---

## 五、前端展示

### 时间轴布局

```
┌─────────────────────────────────────────┐
│  ← 2026年                   2025年 →    │  ← 年份切换
├─────────────────────────────────────────┤
│                                         │
│  ● 6月                                  │  ← 月份标签
│  │                                      │
│  ├── 📸 夏天新发型           6月19日    │  ← 卡片
│  │   ┌────────────────────┐            │
│  │   │ [照片] [照片]       │            │
│  │   │ 换了清爽的夏装 ✨    │            │
│  │   └────────────────────┘            │
│  │                                      │
│  ├── ⚖️ 体重记录             6月15日    │
│  │   ┌────────────────────┐            │
│  │   │ 28.5 kg  ↑0.3kg    │            │
│  │   │ 继续保持健康体重    │            │
│  │   └────────────────────┘            │
│  │                                      │
│  ● 5月                                  │
│  │                                      │
│  ├── 💉 狂犬疫苗             5月20日    │
│  │                                      │
│  ├── 🛁 美容日               5月10日    │
│  │                                      │
│  ▼ 更早...                              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🏠 一切的开始                   │   │
│  │  豆豆到家的那一天                │   │
│  │  2025年6月20日                   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 交互

```
- 上下滑动浏览时间轴
- 点击卡片 → 展开详情
- 点击照片 → 全屏浏览
- 长按卡片 → 分享/编辑/删除
- 年份快速跳转
- "+" FAB 添加新事件
```

---

## 六、与现有功能的关系

```
现有功能：
  growth_records → 自动同步到时间轴（weight类型）
  vaccinations   → 自动同步到时间轴（vaccine类型）
  pets           → 首次创建时自动生成"到家"事件

新增能力：
  时间轴独立事件 → timeline_events 表
  照片附件      → 复用 Supabase Storage
  里程碑标记    → is_milestone 字段高亮展示

不修改现有：
  growth_records / vaccinations 表结构不变
  RLS Policy 不变
  现有 CRUD API 不变
```

---

## 七、页面路由

```
/pets/[id]/timeline     → 时间轴主页
/pets/[id]/timeline/new → 添加事件
```

---

## 八、情绪设计

```
滚动体验:
  向下滚动 = 回到过去
  向上滚动 = 走向现在
  底部 = 一切的开始（到家日）
  顶部 = 今天

颜色叙事:
  近期事件 = 温暖饱和
  远期事件 = 柔和褪色（时间滤镜感）

空状态:
  "还没有故事？
   从添加第一张照片开始吧 📸"
```

---

## 九、实施预估

| Sprint | 内容 | 预估 |
|--------|------|------|
| T1 | timeline_events 表 + API + RLS | 2天 |
| T2 | 时间轴 UI 组件 + 自动同步现有数据 | 3天 |
| T3 | 照片附件 + FAB + 交互细节 | 2天 |
| **合计** | | **7天** |
