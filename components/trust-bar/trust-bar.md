# TrustBar — 奖项信任背书组件

> Navimow 设计系统组件 ｜ 交付日期 2026-09-07 ｜ 预览：同目录 `trust-bar.html` ｜ 当前版本 **v3**

## 1. 用途与命名

网站中展示奖项 / 媒体背书 / 认证的模块，行业通用名：
**Trust Bar / Awards & Recognition / Logo Strip**（Social Proof 大类）。

- 组件名：`TrustBar`
- 页面模块名建议：`Awards & Recognition`（奖项与认可）
- 适用位置：产品详情页中部、首页首屏下方、About/Press 页、结算页（支付信任标识另算）

## 2. 素材规范

- 目录：`assets/`，37 个奖项/媒体 logo（红点、iF、CES、T3、CNET、Forbes、BBC 等）
- 命名：全小写 kebab-case，如 `reddot-winner-21.svg`、`aa-best-of-ces-2026.svg`
- ⚠️ 注意：37 个 SVG 中 35 个是 Figma 导出的「内嵌位图 SVG」（`<image>` 标签包 PNG），
  **不能改 `fill` 单色化**，组件用 CSS `filter: grayscale()` 处理，效果等同。
- 后续新增素材请优先找官方 press kit 的真矢量 SVG。

## 3. 设计规格（v3，白底）

| Token | 值 | 说明 |
|---|---|---|
| `--tb-bg` | `#FFFFFF` | 页面/模块底色 |
| `--tb-fg` | `#1F1F1F` | 主文字色 |
| 卡片底 | 无背景、无边框（白底透出），仅靠透明度区分（非当前 .5 / 当前 1） | v3.3 用户反馈去掉底框 |
| 卡片内文字 | 无（v3.4 移除机构名 caption，aria-label 保留供读屏） | v3.4 |
| `--tb-logo-h` | 96px（移动端 `64px`） | logo 统一高度 |
| `--tb-item-w` | `280px`（移动端 `200px`） | 卡片宽 |
| `--tb-autoplay` | `4500ms` | 停留时长（对齐 Hypershell） |
| `--tb-speed` | `700ms` | 切换过渡 |
| `--tb-gap` | `32px`（移动端 `20px`） | 卡片间距 |
| 字体 | Inter 700 标题 / 600 caption | 品牌规范 |

## 4. 交互与动效（v3）

- **无弹层、无放大**（v3 用户反馈）：点击 logo 不再打开详情卡，直接在轮播内查看
- **无缝循环**：轨道前后各克隆 8 张（BUFFER），滑过缓冲区边缘后瞬时跳回中间等位区，
  视觉上首尾衔接、无限循环；`0 ←上一张→ 34`、`34 →下一张→ 0` 已实测通过
- **上一张/下一张**：点击当前项左边的卡 = 上一张（反向滑动），右边 = 下一张（正向）
- **自动轮播**：4.5s 步进（Hypershell 节奏），hover 视口暂停、移出恢复
- **当前项**：彩色高亮 + 白底阴影；非当前项灰度压暗（opacity .5）
- **两端渐隐**：`mask-image` 遮罩
- **可访问性**：slide 为 `role="button"` 支持 Enter/空格、真实 `alt`、reduced-motion 关过渡
- **数据驱动**：增删奖项只改 `NAVI_AWARDS` 数组（name / org / src）+ 选配字段
- **v3.2 头部联动**：标题/副文案跟随当前奖项动态切换（淡出→换字→淡入 300ms），
  未配置的奖项回退默认文案（`DEFAULT_TITLE` / `DEFAULT_SUB`）；
  **桂冠选配**：数据加 `laurel: true` 时标题两侧显示桂冠枝（JS 程序化生成 SVG，
  贝塞尔弧线 + 10 片交替叶片），`laurel: false` 或缺省则不显示；
  选配字段：`headline`（主标题，支持 `<br>`）、`subline`（副文案）、`laurel`（桂冠开关）

## 5. 用法（数据驱动）

```js
const NAVI_AWARDS = [
  { name: "Red Dot Winner 2021", org: "Red Dot Design Award, Germany", src: "reddot-winner-21.svg" },
];
```

拆入产品页时：把 `<style>` 里 `.trustbar` 相关块和 `<script>` 整体搬走，
`assets/` 相对路径跟随目录调整。BUFFER=8 需满足 ≥ 视口可见卡片数 + 3。

## 6. 版本历史

| 版本 | 变更 |
|---|---|
| v1 | 深/浅双主题，双向 CSS marquee，hover tooltip |
| v2 | 黑色单主题，Hypershell 式步进轮播，点击弹层详情 |
| v2.1 | 移除底部箭头/圆点控件 |
| v2.2 | 弹层点击放大动效（transform-origin 缩放展开） |
| v2.3 | 移除放大动效改淡入；整站改白底 #FFFFFF |
| **v3** | **彻底移除弹层：点击卡片直接查看；无缝循环轨道；支持点左/右侧看上一张/下一张** |

## 7. 已验证（v3）

- 51 slide（35 真实 + 16 克隆）渲染正常、0 破损
- 循环边界：`0 → 34 → 0` 无缝衔接
- 点击方向判定：点左卡反向、点右卡正向
- 自动轮播 + hover 暂停正常
- 白底视觉：当前项高亮清晰、层次分明
