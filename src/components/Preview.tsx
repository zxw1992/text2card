import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { SIZE_DIMENSIONS, type SizeMode } from './CardFrame'

interface Props {
  size: SizeMode
  children: ReactNode
}

/** 卡片内是否有元素被 overflow:hidden 截断（固定尺寸下内容放不下） */
function hasClippedContent(root: HTMLElement | null): boolean {
  if (!root) return false
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
  return nodes.some((el) => el.scrollHeight > el.clientHeight + 2)
}

export function Preview({ size, children }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [innerHeight, setInnerHeight] = useState(0)
  const [clipped, setClipped] = useState(false)

  useEffect(() => {
    function compute() {
      const wrap = wrapRef.current
      if (!wrap) return
      const dim = SIZE_DIMENSIONS[size]
      const availW = wrap.clientWidth - 96
      const availH = wrap.clientHeight - 96
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
  const scaledH = (innerHeight || dim.height || dim.minHeight || 900) * scale

  return (
    <div
      ref={wrapRef}
      className="preview-scroll relative flex h-full flex-1 items-center justify-center overflow-auto p-12"
      style={{ background: 'var(--canvas-bg)' }}
    >
      {clipped && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-amber-600/90 px-4 py-1.5 text-xs font-medium text-white shadow-sm">
          内容超出卡片范围，导出将被截断——可换「自适应」尺寸或精简文本
        </div>
      )}
      <div
        style={{
          width: dim.width * scale,
          height: scaledH,
          position: 'relative',
        }}
      >
        <div
          ref={innerRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            boxShadow: '0 30px 80px -30px rgba(0,0,0,0.35), 0 12px 24px -12px rgba(0,0,0,0.18)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
