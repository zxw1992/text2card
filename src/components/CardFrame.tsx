import { forwardRef, type ReactNode } from 'react'

export type SizeMode = 'auto' | 'portrait' | 'landscape'

export const SIZE_DIMENSIONS: Record<SizeMode, { width: number; height?: number; minHeight?: number }> = {
  auto: { width: 1080, minHeight: 900 },
  portrait: { width: 1080, height: 1440 },
  landscape: { width: 1920, height: 1080 },
}

// 紧凑留白：auto 模式下让卡片基本贴合内容，仅保留下限避免极扁卡片
export const COMPACT_MIN_HEIGHT = 480

interface Props {
  size: SizeMode
  background: string
  children: ReactNode
  radius?: number
  compact?: boolean
}

export const CardFrame = forwardRef<HTMLDivElement, Props>(function CardFrame(
  { size, background, children, radius = 0, compact = false },
  ref,
) {
  const dim = SIZE_DIMENSIONS[size]
  const minHeight = size === 'auto' && compact ? COMPACT_MIN_HEIGHT : dim.minHeight
  return (
    <div
      ref={ref}
      style={{
        width: dim.width,
        height: dim.height,
        minHeight,
        background,
        borderRadius: radius,
        position: 'relative',
        overflow: 'hidden',
        // 内容层走正常文档流（flex 子项），auto 模式下卡片才能随内容长高
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  )
})
