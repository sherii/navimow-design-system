# 拼贴卡片墙 · Collage Card Grid

> Navimow 设计系统组件 ｜ 分类：内容展示 ｜ 版本 v1.0 ｜ 2026-08-30

## 一句话描述

多张「媒体 + 标题 + 副标题」卡片组成的**矩形拼贴墙**，用于产品卖点、场景、教程等内容的错落展示。

---

## 设计 Token

| Token | 值 | 说明 |
|-------|-----|------|
| `--radius` | `16px` | 卡片圆角倒角 |
| `--pad` | `16px` | 卡片内边距 |
| `--gap` | `16px` | 卡片间距 |
| 卡片宽 | `240px`（示例） | 网格单列宽，可按栅格调整 |
| 文字色 | `#FFFFFF` | 标题 |
| 副标题色 | `rgba(255,255,255,.70)` | 副标题 |
| 遮罩渐变 | `rgba(0,0,0,.55)→transparent` | 底部文字可读性 |

---

## 结构

```
.collage（容器，矩形）
  └─ .card（卡片，16 圆角，overflow hidden）
       ├─ .media（背景媒体层）
       │    ├─ img 或 video（object-fit: cover）
       │    └─ .scrim（渐变遮罩）
       ├─ .text（文字层，内边距 16）
       │    ├─ h3（标题）
       │    └─ p（副标题）
       └─ .playing-dot（视频播放指示，可选）
```

---

## 规格要点

### 1. 整体矩形 + 宽度自适应
- 容器 `display: inline-grid`，宽度由内容（列数 × 列宽）决定，不撑满。
- `grid-auto-flow: dense` 自动回填空洞，保证外轮廓始终是规整矩形。
- 尺寸变体：`wide`(跨2列) / `tall`(跨2行) / `big`(2×2)，拼贴错落但整体仍矩形。

### 2. 16px 倒角
- 每张卡片 `border-radius: 16px`，`overflow: hidden`。

### 3. 背景媒体 + 标题 + 副标题，边距 16
- 媒体铺满卡片（图片或视频，`object-fit: cover`）。
- 文字层内边距 16px，压在媒体上，底部加渐变遮罩保证可读。

### 文字对齐（两种）
| 变体 | 对齐 | 实现 |
|------|------|------|
| 默认 | **左下** | `justify-content:flex-end; align-items:flex-start` |
| `.align-center` | **居中 + 顶部 48px** | `justify-content:flex-start; align-items:center; padding-top:48px` |

### 4. Hover 交互
- 背景媒体**轻微放大**：`transform: scale(1.05)`（img/video，`.7s` 缓动）。
- 卡片**跟随鼠标 3D 倾斜**：JS 监听 `mousemove` 计算鼠标相对中心偏移，映射为
  `rotateX(±6°) / rotateY(±8°)`，`perspective(800px)`，rAF 平滑插值（lerp 0.12）。

### 5. 视频播放规则
- 纯视频默认 `autoplay + muted + loop + playsinline`（静音自动播放）。
- **多视频同一时刻只播一个，轮流播放**：JS 维护当前索引，`playOnly(i)` 播放第 i 个、
  其余 `pause + currentTime=0` 复位；定时器（示例 4s）轮换到下一个。
- 播放中的卡片左上角显示橙色 `.playing-dot` 指示。
- **最佳实践**：给 `<video>` 加 `poster="封面图"`，避免"待播放"状态露出黑帧。

---

## 状态

| 状态 | 表现 |
|------|------|
| 默认 | 媒体静止，文字左下/居中显示 |
| Hover | 媒体放大 1.05 + 卡片 3D 倾斜跟随鼠标 |
| 播放中 | 视频播放 + 橙色圆点指示 |
| 待播放 | 视频暂停复位 |

---

## 用法

```html
<div class="collage">
  <div class="card big">
    <div class="media"><img src="x.jpg"></div>
    <div class="scrim"></div>
    <div class="text"><h3>标题</h3><p>副标题</p></div>
  </div>
  <div class="card align-center"><!-- 居中顶48 变体 --></div>
  <div class="card"><!-- 视频卡 --><video muted loop playsinline></video><div class="playing-dot"></div></div>
</div>
```

---

## 关联文件

- 组件实现（可运行演示）：`设计系统/组件/拼贴卡片墙.html`
