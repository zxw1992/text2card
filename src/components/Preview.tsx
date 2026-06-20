import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { SIZE_DIMENSIONS, type SizeMode } from './CardFrame'

interface Props {
  size: SizeMode
  children: ReactNode
  className?: string
  onFitContent?: () => void
}

// 预览缩放：1 = 适应（铺满），可放大到 3 倍拖动查看细节（只放大预览，不影响导出）
const ZOOM_MIN = 1
const ZOOM_MAX = 3
const ZOOM_STEP = 0.5
const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 10) / 10))

/** 卡片内是否有元素被 overflow:hidden 截断（固定尺寸下内容放不下） */
function hasClippedContent(root: HTMLElement | null): boolean {
  if (!root) return false
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
  return nodes.some((el) => el.scrollHeight > el.clientHeight + 2)
}

export function Preview({ size, children, className = '', onFitContent }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [innerHeight, setInnerHeight] = useState(0)
  const [clipped, setClipped] = useState(false)
  const [zoom, setZoom] = useState(1)

  // 切换尺寸时把缩放复位到「适应」
  useEffect(() => {
    setZoom(1)
  }, [size])

  useEffect(() => {
    function compute() {
      const wrap = wrapRef.current
      if (!wrap) return
      const dim = SIZE_DIMENSIONS[size]
      // 实测内边距，移动端 p-4 / 桌面 p-12 两套都准（曾写死 96 = p-12 两侧）
      const cs = getComputedStyle(wrap)
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
      const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
      const availW = wrap.clientWidth - padX
      const availH = wrap.clientHeight - padY
      const measuredH = innerRef.current?.offsetHeight ?? dim.height ?? dim.minHeight ?? 900
      const s = Math.min(availW / dim.width, availH / measuredH, 1)
      setScale(s)
      setInnerHeight(measuredH)
    }
    compute()
    const ro = new ResizeObserver(compute)
    if (wrapRef.current) ro.observe(wrapRef.current)
    if (innerRef.current) ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [size])

  // 溢出检测：卡片内容（含 Shiki 异步高亮）变化时重新检查。
  // 固定尺寸下卡片外框尺寸不变，ResizeObserver 收不到通知，需用 MutationObserver。
  useEffect(() => {
    let raf = 0
    const check = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setClipped(hasClippedContent(innerRef.current)))
    }
    check()
    const mo = new MutationObserver(check)
    if (innerRef.current) {
      mo.observe(innerRef.current, { childList: true, subtree: true, characterData: true })
    }
    return () => {
      mo.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [size, children])

  const dim = SIZE_DIMENSIONS[size]
  const effScale = scale * zoom
  const scaledH = (innerHeight || dim.height || dim.minHeight || 900) * effScale

  return (
    <div className={`relative h-full flex-1 ${className}`}>
      {/* 滚动区：margin:auto 居中（而非 justify-center），放大溢出时可滚动到各边而不被裁 */}
      <div
        ref={wrapRef}
        className="preview-scroll canvas-bg flex h-full w-full overflow-auto p-4 md:p-12"
      >
        {clipped && (
          <div className="absolute left-1/2 top-4 z-10 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-amber-600/95 py-1.5 pl-4 pr-1.5 text-xs font-medium text-white shadow-sm">
            <span>内容超出卡片，导出将被截断</span>
            {size !== 'auto' && onFitContent && (
              <button
                onClick={onFitContent}
                className="shrink-0 rounded-full bg-white/25 px-2.5 py-1 font-medium transition hover:bg-white/35"
              >
                切到自适应
              </button>
            )}
          </div>
        )}
        <div
          style={{
            width: dim.width * effScale,
            height: scaledH,
            position: 'relative',
            margin: 'auto',
            flex: 'none',
          }}
        >
          <div
            ref={innerRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `scale(${effScale})`,
              transformOrigin: 'top left',
              boxShadow: '0 30px 80px -30px rgba(0,0,0,0.35), 0 12px 24px -12px rgba(0,0,0,0.18)',
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* 缩放控制：固定在预览区右下角，不随卡片滚动 */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-0.5 rounded-full border border-ink-200/70 bg-white/85 p-1 text-ink-600 shadow-sm backdrop-blur">
        <button
          onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
          disabled={zoom <= ZOOM_MIN}
          title="缩小"
          className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-ink-100 disabled:opacity-40"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          title="复位到适应"
          className="min-w-[3rem] rounded-full px-1 text-xs tabular-nums transition hover:bg-ink-100"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
          disabled={zoom >= ZOOM_MAX}
          title="放大"
          className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-ink-100 disabled:opacity-40"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
