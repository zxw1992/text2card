import { forwardRef, type ReactNode } from 'react'

export type SizeMode = 'auto' | 'portrait' | 'landscape'

export const SIZE_DIMENSIONS: Record<SizeMode, { width: number; height?: number; minHeight?: number }> = {
  auto: { width: 1080, minHeight: 900 },
  portrait: { width: 1080, height: 1440 },
  landscape: { width: 1920, height: 1080 },
}

// 紧凑留白：auto 模式下让卡片基本贴合内容，仅保留下限避免极扁卡片。
// 默认下限偏保守；代码等需要更高下限的卡片用 compactMinHeight 覆盖，
// 竖排诗词则整体不参与紧凑（高度被压会导致竖排折列）。
export const COMPACT_MIN_HEIGHT = 480

export const SIZE_OPTIONS: { value: SizeMode; label: string }[] = [
  { value: 'auto', label: '自适应' },
  { value: 'portrait', label: '3 : 4' },
  { value: 'landscape', label: '16 : 9' },
]

interface Props {
  size: SizeMode
  background: string
  children: ReactNode
  radius?: number
  compact?: boolean
  /** 紧凑模式下的最小高度，缺省用 COMPACT_MIN_HEIGHT */
  compactMinHeight?: number
}

export const CardFrame = forwardRef<HTMLDivElement, Props>(function CardFrame(
  { size, background, children, radius = 0, compact = false, compactMinHeight = COMPACT_MIN_HEIGHT },
  ref,
) {
  const dim = SIZE_DIMENSIONS[size]
  const minHeight = size === 'auto' && compact ? compactMinHeight : dim.minHeight
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
