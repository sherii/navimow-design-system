---
name: navimow-i18n-qa
description: Navimow 多语言页面适配检查：小语种收窄态、标题行数上限、逐语种实测。
---

# Navimow 多语言页面适配检查（i18n QA）

DTC 站要出多语言版本（欧洲/北美），同一组件/页面在不同语种下的收窄态、换行、
溢出检查。目标：**每个语种都不溢出、不截断、不塌陷**。

## When to Use

- 组件/页面要上多语言，或用户说「看看法语/德语/荷兰语下会不会溢出」。
- 触发词：多语言、i18n、小语种、收窄态、溢出、BE-fr、BE-nl、德语、法语、荷兰语。

## 检查清单（每版必过）

1. **标题行数上限**：收窄态下标题最多 **3 行**，超过 3 行 = 溢出/压版，要处理。
2. **收窄态**：模拟小语种（德语/荷兰语词长最长）最窄容器宽度下，文字不溢出容器。
3. **换行不破词**：检查 `word-break` / `overflow-wrap`，长单词（德语复合词）不能硬截断。
4. **按钮/CTA**：不同语种的 CTA 文案长度差异大，按钮不能因文案变长而变形。
5. **手风琴/折叠**：展开态内容在小语种下高度变高，检查是否压到相邻元素。

## 已验证语种

实测通过的语种基线（作为回归参照）：**BE-fr / BE-nl / IT / SE / DE**。
新增语种时优先用德语、荷兰语做「最坏情况」测试（词长最长、最易溢出）。

## 检测方法

用浏览器 JS 做溢出断言，比肉眼截图可靠：

```js
// 某元素是否溢出（文字高度超出容器）
const el = document.querySelector('.title');
JSON.stringify({
  scrollHeight: el.scrollHeight,
  clientHeight: el.clientHeight,
  overflow: el.scrollHeight > el.clientHeight + 1,  // 留 1px 容差
  lines: Math.round(el.scrollHeight / parseFloat(getComputedStyle(el).lineHeight)),
});
```

- 多行标题行数判断：`scrollHeight / lineHeight` 取整，> 3 即超上限。
- 收窄态：直接设置容器宽度到目标断点（如 320px）再断言，不必真改窗口。

## 坑

- **描述文字渐显/出现类动效在 i18n 下尤其晃眼**，用户明确移除过（手风琴描述文字）——
  见 `navimow-motion-patterns` 的微动效尺度红线。
- 溢出修复优先「改断点/字号 clamp」，不要简单粗暴缩小到看不清。
- 改共享 class 修某个语种时，要回其他语种 + 其他模块复测（同一 class 可能复用）。
