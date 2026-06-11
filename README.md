# text2card · 文案卡片美化

把任意文本 / 代码 / Markdown / 诗词，一键变成可分享的精美图片。

本地运行，零后端，无需登录。审美是第一优先级。

---

## 特性

- **4 套独立设计语言的卡片**，按内容自动建议、手动可换：
  - 代码（Carbon 风暗色 IDE，6 个 VS Code 主题）
  - 金句（大字海报，4 套柔和渐变 + 装饰引号）
  - 长文 Markdown（杂志风，3 套配色，标题/列表/引用/代码块全自定义渲染）
  - 中文古典诗词（竖排宣纸 + 红印章，自动从《》和 —— 提取标题作者）
- **内容启发式分类器**：粘贴即识别，chips 上会标 `自动 · 长文` 这样的判定
- **3 种导出尺寸**：自适应（宽 1080）/ 3:4 竖图（1080×1440）/ 16:9 横图（1920×1080）
- **一键导出 PNG**，`pixelRatio: 3`，分享到手机不糊
- **真·本地**：所有渲染在浏览器里发生，文本不会离开你的电脑

---

## 运行

要求 Node.js ≥ 18（Vite 5 的最低要求），macOS / Windows / Linux 均可。

```bash
npm install
npm run dev
```

浏览器打开 <http://localhost:5173/>。导出 PNG 建议使用 Chrome / Edge 等
Chromium 系浏览器——html-to-image 的 DOM→SVG→canvas 渲染路径在 Safari
上有已知 bug（字体丢失、图像空白）。

构建生产版本：

```bash
npm run build
npm run preview
```

---

## 使用

1. 左侧粘贴文本（或点击顶部的 `金句 / 代码 / 长文 / 诗词` 示例）
2. 中间实时预览
3. 顶部 chips 可手动切换风格和尺寸；右侧选主题、填标题/作者等
4. 右上角 **导出 PNG** 下载图片

### 各卡片识别规则

| 内容形态 | 自动归类 |
|---|---|
| 含 \`\`\` 代码围栏，或前几行多为 `function/class/import/<...>` 等 | **代码** |
| 含《标题》后跟若干 4-9 字中文短句对仗 | **诗词** |
| 含 Markdown 语法（`#`、`-`、`>`、表格 等）或 > 300 字 | **长文** |
| 短句、有引号包裹、≤ 140 字 | **金句** |

判错也没关系——chips 一点就换。

代码围栏的语言标记支持常见简写（\`\`\`js、\`\`\`py、\`\`\`sh 等），写了无效语言时会自动回退到代码内容检测。

### 各卡片支持的元数据

| 卡片 | 字段 |
|---|---|
| 代码 | 文件名（不填会按语言自动猜 `snippet.ts` 之类） |
| 金句 | 署名 |
| 长文 | 眉头标签 / 标题 / 署名 |
| 诗词 | 标题 / 作者 / 竖排或横排 |

---

## 技术栈

- Vite + React 18 + TypeScript
- Tailwind CSS v3（设计 token 在 `tailwind.config.ts`）
- [Shiki](https://shiki.style/) — 代码高亮（直接用 VS Code TextMate 主题）
- [html-to-image](https://github.com/bubkoo/html-to-image) — DOM → PNG
- [react-markdown](https://github.com/remarkjs/react-markdown) + remark-gfm — Markdown 渲染
- highlight.js — 代码语言自动识别

## 项目结构

```
src/
├── App.tsx                       三栏布局 + 状态
├── lib/
│   ├── classifier.ts             内容分类启发式
│   ├── exporter.ts               html-to-image 封装
│   ├── shiki.ts                  Shiki 单例
│   └── detectLang.ts             代码语言识别
├── components/
│   ├── Editor.tsx                左：编辑器 + 示例 chips
│   ├── Preview.tsx               中：等比缩放预览
│   ├── Controls.tsx              右：主题 / 字段
│   ├── CardFrame.tsx             导出根节点，统一尺寸
│   └── cards/
│       ├── CodeCard.tsx
│       ├── QuoteCard.tsx
│       ├── ProseCard.tsx
│       └── PoetryCard.tsx
├── themes/                       每种风格各自的主题表
└── styles/index.css              Tailwind + 字体 + 噪点
```

## 自定义主题

每个 `themes/*.ts` 文件是一个数组，复制一项改色值即可：

```ts
// themes/quoteThemes.ts
{
  name: '夜空',
  background: 'radial-gradient(... ) , linear-gradient(...)',
  text: '#ffffff',
  accent: '#ffd166',
  rule: 'rgba(255,255,255,0.25)',
  quoteMark: 'rgba(255,209,102,0.2)',
  noise: 0.08,
}
```

保存后 dev server 热更新，右侧主题面板会自动出现新项。

## 字体

通过 Google Fonts CDN 加载：

- **Fraunces** — 英文衬线（金句 / 长文标题）
- **Inter** — 英文 sans（UI / 署名）
- **JetBrains Mono** — 等宽（代码）
- **Noto Serif SC** — 思源宋体（中文金句 / 诗词 / 长文正文）
- **Ma Shan Zheng** — 楷书（诗词标题 / 印章）

## 已知限制

- **字体内联**：由于浏览器的同源策略，html-to-image 无法把 Google Fonts 的 CSS 内联到 SVG。导出图会用浏览器已加载的 web font 渲染（实测中文宋体、JetBrains Mono 都能正常显示，英文 Inter 在 SVG 序列化时偶尔回退到系统 sans）。如需 100% 字体保真，可把字体改成 self-host woff2 并写入 `@font-face` data URI。
- **自适应尺寸** 的 min-height 是 900px，短内容底部会有留白（设计上有意，避免极扁卡片）。

## License

MIT
