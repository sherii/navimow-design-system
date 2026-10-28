---
name: navimow-component-build
description: 构建 Navimow 设计系统 HTML 组件时的规范、流程与用户设计偏好。
---

# Navimow 设计系统组件构建

做/改「设计系统/组件」下任何 HTML 组件（TrustBar、拼贴卡片墙等）时的固定流程与偏好。

## When to Use

- 用户要求做/改任何 HTML 组件（TrustBar、卡片墙、轮播、logo 墙、信任背书等）。
- 用户交付 logo/素材让你做成网页组件，或要求复刻某网站的某个模块。
- 触发词：组件、信任背书、TrustBar、logo 墙、轮播、卡片墙、设计系统组件。

## 交付物结构（固定约定）

```
设计系统/组件/<component-name>/
├── assets/          ← 素材（用户放入或本任务生成）
├── <component-name>.html   ← 自包含可预览组件（单文件：内联 CSS+JS）
└── <component-name>.md     ← 规范文档（用途/命名/token 表/交互/用法/版本历史/已验证）
```

- 组件必须数据驱动：素材清单放 JS 数组（name/org/src），增删只改数组。
- 不要把素材放 `项目记录/assets/`（那边是 Figma 过程素材，节点 ID 命名）。

## 素材管线

1. 素材文件名统一 kebab-case 小写（用户交付常是 `奖项=XXX.svg` 形式，批量重命名）。
2. **Figma 导出的 SVG 多为「内嵌位图 SVG」**（`<image>` 标签包 base64 PNG）：
   先检测 `'<image' in svg` —— 这类不能改 `fill` 单色化，用 CSS `filter: grayscale()` 替代。
3. 真矢量 SVG（含多个 fill hex）才能 fill 级操作。
4. 官方奖项 logo 优先找 press kit / brand assets 页下载，比截图清晰。

## 浏览器验证工作流（每版必做）

详见 `references/verification-recipe.md`（验证配方）与
`references/laurel-generator.md`（桂冠等程序化装饰 SVG 生成器 + 调参坑）。要点：
- **file:// 页面的子资源在远程自动化浏览器里加载不了** → 起本地服务：
  `python3 -m http.server 8742`（background），验完 kill。
- 图片"破损"检测用 `getBoundingClientRect().height < 10`，**不要只看
  `naturalWidth===0`**——无内在尺寸的 SVG 会误报；且 lazy-load 未完成时也会误报，先等 1.5–2.5s。
- 交互链路（点击/翻页/弹层）用 JS evaluate 直接驱动并断言状态，比截图可靠。
- 参考图复刻线性 SVG 图标（描边风格 icon）见 `references/linear-icon-replication.md`。

## 用户组件设计偏好（多次纠正沉淀，做新组件时默认遵守）

- **默认背景纯白 `#FFFFFF`**，文字 `#1F1F1F`；非用户要求不做黑色主题。
- **不要底部轮播控件**（箭头/圆点）——用户明确移除过。
- **不要弹层/放大详情**效果——用户明确要求移除；点击 = 直接在轮播内查看。
- **卡片无阴影**——用户明确移除过全部 box-shadow（含当前项高亮的）；层次靠底色
  （非当前 #F7F7F5 / 当前 #FFFFFF）+ 边框深浅区分，不靠阴影。
- **轮播要首尾无缝循环**，且点左/右两侧卡片 = 上一张/下一张（带方向）。
- **Logo 统一高度**（TrustBar 用 96px 桌面 / 64px 移动端）。
- 节奏参照 Hypershell：autoplay 停留 ≈4.5s、过渡从容（用户嫌默认滚动太快）。
- 用户反馈常按版本小步迭代（v1→v2→v2.1…），md 文档里维护版本历史表，
  每次改动后本地复测再交付。
- **装饰元素选配 + 文案联动**（TrustBar v3.2 沉淀）：头部大标题/副文案不是静态的，
  跟随当前轮播项动态切换（淡出→换字→淡入）；装饰（如桂冠）按数据字段选配
  （`laurel: true/false`），未配置项回退默认文案。
  数据数组字段：必填 `name/org/src` + 选配 `laurel/headline/subline`。
- **装饰图形用 JS 程序化生成 SVG**，不要手写 path 硬编码——可调参迭代。
  坑：叶片路径以「向上」为本地基准时，旋转角要 `切线角 + 90° + 侧偏角`。
- **微动效尺度（用户两次打回后定稿）**：文字渐显/出现类动画 = 「晃眼睛」，不要做；
  但**无过渡的瞬切同样被嫌「生硬」**。布局级过渡（卡片宽度/展开收起）可以做，正解是
  **双层交叉淡化 + 内容层固定宽度幕帘**（先淡出后淡入，总感知 ≈0.4s）。
- **3D 风格图标用纯 SVG 画，不要位图**：哑光软胶质感 = 每块形状一个 linearGradient
  （浅→深同色系，明暗差 ~20%）+ 白色高光 + **不要投影**；厚圆角（rx ≈ 高 20–25%）。
  配色只用三色系：奶油白 `#FBF7EF→#EBE1CE`、深蓝 `#3D5BD9→#2743A8`、砖红 `#CE4658→#A82C3E`。

## 已知坑

- 用 patch 做多处 CSS 替换时，`old_string` 跨块容易把 `@media` 开头行吃掉——
  每次结构性替换后搜一遍残留/语法完整性再验证。
- hover 暂停这类"顺带"行为在删减代码时容易被误删，交付前对照交互清单逐条复测。
- **改共享 class 的容器样式会波及其他模块**：凡改动 `.icon` / `.card` 这类跨模块
  复用的 class，改完必须回**所有引用处**逐一复测渲染，不要只看当次任务的那个模块。
