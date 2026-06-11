import { forwardRef, type ReactNode } from 'react'

export type SizeMode = 'auto' | 'portrait' | 'landscape'

export const SIZE_DIMENSIONS: Record<SizeMode, { width: number; height?: number; minHeight?: number }> = {
  auto: { width: 1080, minHeight: 900 },
  portrait: { width: 1080, height: 1440 },
  landscape: { width: 1920, height: 1080 },
}

interface Props {
  size: SizeMode
  background: string
  children: ReactNode
  radius?: number
}

export const CardFrame = forwardRef<HTMLDivElement, Props>(function CardFrame(
  { size, background, children, radius = 0 },
  ref,
) {
  const dim = SIZE_DIMENSIONS[size]
  return (
    <div
      ref={ref}
      style={{
        width: dim.width,
        height: dim.height,
        minHeight: dim.minHeight,
        background,
        borderRadius: radius,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
})
