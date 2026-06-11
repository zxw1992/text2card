import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { SIZE_DIMENSIONS, type SizeMode } from './CardFrame'

interface Props {
  size: SizeMode
  children: ReactNode
}

export function Preview({ size, children }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [innerHeight, setInnerHeight] = useState(0)

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
  }, [size, children])

  const dim = SIZE_DIMENSIONS[size]
  const scaledH = (innerHeight || dim.height || dim.minHeight || 900) * scale

  return (
    <div
      ref={wrapRef}
      className="preview-scroll relative flex h-full flex-1 items-center justify-center overflow-auto p-12"
      style={{ background: 'var(--canvas-bg)' }}
    >
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
