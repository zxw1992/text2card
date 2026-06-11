import { toSvg } from 'html-to-image'

/**
 * 自建字体内联 CSS：只内联「浏览器实际加载过的」@font-face 分片。
 * - 字体 self-host 后样式表同源，cssRules 可读，导出不再丢字体；
 * - CJK 字体按 unicode-range 分了上百片，全量内联会有几十 MB，
 *   而页面上出现过的字符所需分片必然已被浏览器加载，按需内联即可保真。
 */
let fontCssCache: { key: string; css: string } | null = null

// 注意：FontFace.unicodeRange 是「U+xx, U+yy」带空格格式，cssRules 里不带，
// 必须把空白全部去掉再比较
function norm(s: string): string {
  return s.replace(/["']/g, '').replace(/\s+/g, '').toLowerCase()
}

export async function buildFontEmbedCss(): Promise<string> {
  await document.fonts.ready
  const loaded = new Set(
    Array.from(document.fonts)
      .filter((f) => f.status === 'loaded')
      .map((f) => `${norm(f.family)}|${norm(f.weight)}|${norm(f.style)}|${norm(f.unicodeRange)}`),
  )
  const key = Array.from(loaded).sort().join(';')
  if (fontCssCache?.key === key) return fontCssCache.css

  const parts: string[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      continue // 跨域样式表（理论上已不存在）
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue
      const st = rule.style
      const ruleKey = [
        norm(st.getPropertyValue('font-family')),
        norm(st.getPropertyValue('font-weight') || 'normal'),
        norm(st.getPropertyValue('font-style') || 'normal'),
        norm(st.getPropertyValue('unicode-range') || 'u+0-10ffff'),
      ].join('|')
      if (!loaded.has(ruleKey)) continue

      const src = st.getPropertyValue('src')
      const woff2 = src.match(/url\(["']?([^"')]+\.woff2)["']?\)/)?.[1]
      if (!woff2) continue
      const abs = new URL(woff2, sheet.href ?? document.baseURI).href
      const blob = await fetch(abs).then((r) => r.blob())
      const dataUrl = await new Promise<string>((resolve) => {
        const fr = new FileReader()
        fr.onload = () => resolve(fr.result as string)
        fr.readAsDataURL(blob)
      })
      parts.push(
        rule.cssText.replace(/src:[^;}]+[;}]/, `src: url(${dataUrl}) format('woff2');`),
      )
    }
  }
  const css = parts.join('\n')
  fontCssCache = { key, css }
  return css
}

const PIXEL_RATIO = 3

/**
 * 不用 toPng：它在 SVG 内嵌字体解码完成前就栅格化，文字会回退系统字体
 * （Chrome 对 foreignObject 字体加载没有同步保证）。这里自己控制绘制：
 * 先画一次触发字体解码，之后重画并对比低分辨率签名，稳定两次才算就绪。
 */
async function rasterize(svgDataUrl: string, w: number, h: number): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = w * PIXEL_RATIO
  canvas.height = h * PIXEL_RATIO
  const ctx = canvas.getContext('2d')!
  ctx.scale(PIXEL_RATIO, PIXEL_RATIO)

  const PROBE = 192 // 探针分辨率要能看见小元素（如诗词卡印章字）的变化
  const probe = document.createElement('canvas')
  probe.width = PROBE
  probe.height = PROBE
  const probeCtx = probe.getContext('2d', { willReadFrequently: true })!

  const signature = () => {
    probeCtx.clearRect(0, 0, PROBE, PROBE)
    probeCtx.drawImage(canvas, 0, 0, PROBE, PROBE)
    return probeCtx.getImageData(0, 0, PROBE, PROBE).data.join(',')
  }

  // 关键：img 必须挂在文档里被真实绘制——脱离文档的 SVG 图像永远不会
  // 触发内嵌字体的加载，drawImage 拿到的一直是无字体的首帧（且冷热一致，
  // 极具迷惑性）。挂载后用近零透明度避免闪烁，绘制驱动字体解码完成，
  // 之后的 drawImage 才能拿到字体就绪的结果。
  const img = new Image()
  img.src = svgDataUrl
  img.style.cssText =
    'position:fixed;top:0;left:0;opacity:0.001;pointer-events:none;z-index:-1'
  document.body.appendChild(img)
  try {
    await img.decode()
    // SVG 里内嵌的字体分片分阶段解码，绘制结果会经历多次变化才定型。
    // 退出条件：连续 3 次绘制一致，且总耗时已过 1.2s（防止停在解码中途
    // 的「安静窗口」）。
    const start = performance.now()
    let prev = ''
    let stableCount = 0
    for (;;) {
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
      const sig = signature()
      const elapsed = performance.now() - start
      stableCount = sig === prev ? stableCount + 1 : 0
      prev = sig
      if (stableCount >= 2 && elapsed > 1200) break
      if (elapsed > 10000) break
      await new Promise((r) => setTimeout(r, 300))
    }
  } finally {
    img.remove()
  }
  return canvas
}

/** 渲染卡片为 canvas（导出与测试共用） */
export async function renderPngCanvas(node: HTMLElement): Promise<HTMLCanvasElement> {
  await document.fonts.ready
  await new Promise((r) => requestAnimationFrame(() => r(null)))
  const fontEmbedCSS = await buildFontEmbedCss()
  const svg = await toSvg(node, {
    cacheBust: false,
    fontEmbedCSS,
    style: { transform: 'none' },
  })
  return rasterize(svg, node.offsetWidth, node.offsetHeight)
}

export async function exportPng(node: HTMLElement, filename: string) {
  const canvas = await renderPngCanvas(node)
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas.toBlob 返回空'))), 'image/png')
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
