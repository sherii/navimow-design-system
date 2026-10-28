---
name: navimow-figma-replication
description: Figma → HTML 100% 复刻流程：占位文案保留、限流分批退避、内嵌位图 SVG 处理。
---

# Navimow Figma → HTML 复刻流程

把 Figma 设计稿高保真复刻成自包含 HTML 的固定流程。目标是「**100% 还原**」。

## When to Use

- 用户给一个 Figma 链接/文件，要求复刻成 HTML 页面/组件。
- 触发词：复刻、还原、Figma、专题页、产品页、h5pro、像素级。

## 核心原则（先记住这三条）

1. **100% 还原，占位文案也要原样保留**：原稿里的占位文案（`Button`、`Link`、
   `We prioritize people`）**原样保留**，不要擅自替换成"合理"的文案。
2. **文案严格按用户给的逐屏内容表格**（板块 / 内容 / CTA / Ref），不自行增补句子。
3. **动效偏好 Apple / DJI 详情页式滚动驱动**：scroll-pin、进场出场、3D tilt、count-up；
   微动效尺度见 `navimow-motion-patterns`（文字渐显会被打回）。

## 流程

1. **取数据**：从 Figma 拉文件/节点树 + 导出图片。
   - Figma API 易限流（可达 26s/请求），**大批量导出必须分批 + 退避重试**。
   - 节点 ID 命名规范：图片按 `I<id>;<id>_<name>` 落到 `项目记录/assets/`，不要混进组件目录。
2. **处理 SVG**：Figma 导出的 SVG 多为「内嵌位图 SVG」（`<image>` 包 base64 PNG），
   检测到 `'<image' in svg` 就不能改 `fill` 单色化，用 `filter: grayscale()` 替代。
3. **组装 HTML**：单文件自包含（内联 CSS+JS），图片放本地 `assets/` 相对路径。
4. **路径自包含**：交付前把 html 里指向过程目录的路径（如 `项目记录/assets/`）
   统一改写成页面同目录的 `assets/`，保证拷贝到任何地方都能开。
5. **浏览器验证**：见 `navimow-component-build` 的 `references/verification-recipe.md`。
   - file:// 子资源在自动化浏览器里加载失败 → 起 `python3 -m http.server` 再验。
   - 图片破损用 `getBoundingClientRect().height < 10` 判，别只看 `naturalWidth`。

## 坑

- 复刻第三方网站布局时，只复刻「布局/结构/风格」，**不要**带第三方品牌资产（logo、
  商标、专有文案）；换成自己的内容，并在 README 注明"风格研究/学习目的"。
- 大批量导出图片若中途失败，优先补漏（记录已下载清单）而不是整体重下。
- 改共享 class 会影响其他模块，改完回所有引用处复测。

## 脱敏铁律

- Figma personal access token、文件 key、内部服务地址**绝不写进任何交付文件/仓库**。
- 交付物里不出现内部工具链接（飞书、内网 API 等）。
