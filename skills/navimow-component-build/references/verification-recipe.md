# 组件浏览器验证配方（TrustBar 等自包含 HTML 组件实测沉淀）

## 1. 为什么不能用 file:// 直接验

远程自动化浏览器（browser_* 系）里，`file://` 页面的**子资源**（相对路径 img/css/js）
加载全部失败——页面 HTML 能开但图片 36/36 全挂，且 `fetch` 相对/绝对 file 路径都报
`Failed to fetch`。本地 `read_preview`/预览面板不受影响。

**修法**：起本地 HTTP 服务再验：

```bash
cd "<组件目录>" && python3 -m http.server 8742   # terminal background=true
# 验完必收尾：
# process(action='kill', session_id=...)
```

验证地址：`http://localhost:8742/<component>.html`

## 2. 图片"破损"判定（避免误报）

两层误报都要避开：

1. **lazy-load 时序**：刚导航完立即查，`loading="lazy"` 的图还没加载，`naturalWidth===0`
   会误报全挂 → 先 `setTimeout` 等 1.5–2.5s 再查。
2. **无内在尺寸的 SVG**：部分 SVG `naturalWidth` 天然为 0 但渲染完全正常 →
   以渲染尺寸为准：

```js
const broken = imgs.filter(i => i.getBoundingClientRect().height < 10);  // 视觉破损
```

背景服务 200 日志（`GET /assets/x.svg 200`）是资源可达的最强证据。

## 3. 交互链路验证（比截图可靠）

用 `browser_console` 的 JS evaluate 直接驱动并断言状态：

```js
// 例：弹层/点击链路
document.querySelector('.tb-slide.is-active').click();
JSON.stringify({open: modal.classList.contains('is-open'), ...})
```

注意：
- `browser_click` 的自动化点击有落点/时序偏差（尤其配合动画时点不中/被吞），
  **点击后用 JS 读状态确认**，不要默认成功。
- `browser_vision` 截图时机要配合 JS：先 JS 确认目标状态在屏，再截图，否则拍到过期画面。

## 4. 无缝循环轮播实现要点（TrustBar v3 实测方案）

- 轨道 = `[-BUFFER 克隆] + [整组原件] + [+BUFFER 克隆]`，BUFFER=8（≥ 视口可见数+3）。
- 滑到缓冲边缘后 `transition:'none'` 瞬时跳回中间等位区，`void stage.offsetWidth` 强制
  回流再恢复过渡——否则下次切换瞬移。
- 方向判定：点当前项右边的卡 = 下一张（正向找 target），左边 = 上一张（反向找）。
- `animating` 锁防止连点穿帮（测试脚本连点时每次间隔 ≥ SPEED_MS+150ms）。

## 5. 参考节奏（Hypershell 实测）

`https://hypershell.tech` 奖项区是 Shopify Swiper：`autoplay delay≈4-5s、speed:300ms、
loop、centeredSlides、pauseOnMouseEnter`。用户嫌快，我们用 delay 4500 / 过渡 700ms。
抓参数方法：curl 页面 HTML → 找 section 引用的 `*.min.js` → 在 bundle 尾部找
`new V(e, {...})` 初始化参数。
