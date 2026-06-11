import { toPng } from 'html-to-image'

export async function exportPng(node: HTMLElement, filename: string) {
  await document.fonts.ready
  await new Promise((r) => requestAnimationFrame(() => r(null)))
  const dataUrl = await toPng(node, {
    pixelRatio: 3,
    cacheBust: true,
    skipFonts: false,
    style: { transform: 'none' },
  })
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
