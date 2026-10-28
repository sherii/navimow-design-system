# 桂冠（Laurel）SVG 程序化生成器 — 已验证版本

来源：TrustBar v3.2（2026-09-07），实拍确认形态自然、与参考图（CES Best of Innovation 版式）一致。
用法：JS 返回 SVG 字符串，注入两个容器，右侧容器整体 `scaleX(-1)` 镜像。

## 经验教训（写这里防止下次重踩）

1. **叶片旋转角必须 `切线角 + 90°`**：叶片 path 以「朝上」为本地基准（`M0 0 Q…0 -len`），
   沿曲线布叶时旋转 = 曲线切线角 + 90° + 左右侧偏（±55°）。漏掉 90° 会导致所有叶片
   指向枝条反方向，视觉呈倒刺/锯齿状。第一版和第二版都栽在这里，靠截图才发现。
2. **ellipse 挤在一起会成黑坨**：早期用小 ellipse + 密集采样（9 片、间距 0.105），
   放大后叶片粘连。改用两条二次贝塞尔拼成的细长柳叶形 + 10 片大间距后解决。
3. **调参必走浏览器截图验证**：程序化图形纯靠坐标脑补不可靠，每改一版
   `browser_vision` 带「形态是否自然/是否黑坨/左右对称」问题清单确认。

## 生成器代码（验证版）

```js
function laurelSVG() {
  // 三次贝塞尔枝条：从右下弧到左上（左支；右支 scaleX(-1) 镜像）
  const P0 = [40, 78], P1 = [18, 58], P2 = [10, 30], P3 = [26, 3];
  const pt = t => {
    const u = 1 - t;
    return [
      u*u*u*P0[0] + 3*u*u*t*P1[0] + 3*u*t*t*P2[0] + t*t*t*P3[0],
      u*u*u*P0[1] + 3*u*u*t*P1[1] + 3*u*t*t*P2[1] + t*t*t*P3[1],
    ];
  };
  const tg = t => {          // 切线角（度）
    const u = 1 - t;
    const dx = 3*u*u*(P1[0]-P0[0]) + 6*u*t*(P2[0]-P1[0]) + 3*t*t*(P3[0]-P2[0]);
    const dy = 3*u*u*(P1[1]-P0[1]) + 6*u*t*(P2[1]-P1[1]) + 3*t*t*(P3[1]-P2[1]);
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };
  const leafPath = (x, y, rot, len) => {
    // 细长柳叶形：两条二次贝塞尔；本地坐标以「朝上」为基准
    const w = len * 0.32;
    return `<path d="M0 0 Q ${w} ${-len*0.45} 0 ${-len} Q ${-w} ${-len*0.45} 0 0 Z" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})" fill="#1F1F1F"/>`;
  };
  let leaves = "";
  const N = 10;
  for (let i = 0; i < N; i++) {
    const t = 0.06 + i * (0.88 / (N - 1));
    const [x, y] = pt(t);
    const ang = tg(t);
    const side = i % 2 === 0 ? 1 : -1;             // 左右交替
    const rot = ang + 90 + side * 55;              // +90 是关键：叶基准朝上
    const len = 15 - i * 0.75;                     // 顶端叶片渐小
    leaves += leafPath(x, y, rot, len);
  }
  return `<svg viewBox="0 0 52 82" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 78 C18 58 10 30 26 3" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" fill="none"/>
    ${leaves}
  </svg>`;
}
// 注入：
// left.innerHTML  = laurelSVG();
// right.innerHTML = laurelSVG().replace('<svg ', '<svg style="transform:scaleX(-1)" ');
```

## 显示参数（TrustBar 实测协调值）

- 容器尺寸：`72px × 110px`（标题 clamp(28-44px) 时）
- 与文字间距：`gap: 36px`
- 选配显示：容器默认 `opacity:0; scale(.85)`，`laurel: true` 时过渡到 `opacity:1; scale(1)`
- 颜色：深色主题 `#1F1F1F`（白底）；深底站点换 `#FFF` 即可（参数化 stroke/fill）
