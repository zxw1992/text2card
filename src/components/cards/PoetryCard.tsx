import { forwardRef } from 'react'
import { CardFrame, type SizeMode } from '../CardFrame'
import type { PoetryTheme } from '../../themes/poetryThemes'

interface Props {
  text: string
  theme: PoetryTheme
  size: SizeMode
  title?: string
  author?: string
  vertical?: boolean
  compact?: boolean
}

export const PoetryCard = forwardRef<HTMLDivElement, Props>(function PoetryCard(
  { text, theme, size, title, author, vertical = true, compact },
  ref,
) {
  const padOuter = size === 'landscape' ? 100 : 120
  const allLines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  let extractedTitle = ''
  let extractedAuthor = ''
  let bodyLines = allLines
  if (allLines[0]) {
    const m = allLines[0].match(/^《([^》]+)》$/)
    if (m) {
      extractedTitle = m[1]
      bodyLines = allLines.slice(1)
    }
  }
  if (bodyLines.length) {
    const last = bodyLines[bodyLines.length - 1]
    if (/^[—\-]+\s*\S/.test(last) || /^[（(].+[）)]$/.test(last)) {
      extractedAuthor = last.replace(/^[—\-]+\s*/, '')
      bodyLines = bodyLines.slice(0, -1)
    }
  }
  const displayLines = bodyLines.length ? bodyLines : ['空山新雨后', '天气晚来秋']
  const t = title || extractedTitle
  const a = author || extractedAuthor
  const isLong = displayLines.join('').length > 60

  return (
    <CardFrame ref={ref} size={size} background={theme.background} compact={compact && !vertical}>
      <InkWash color={theme.wash} />
      <div className="noise-overlay" style={{ opacity: 0.08 }} />

      <div
        style={{
          position: 'relative',
          flex: '1 1 auto',
          minHeight: 0,
          padding: padOuter,
          display: 'flex',
          flexDirection: 'column',
          color: theme.text,
        }}
      >
        {vertical ? (
          <VerticalLayout
            lines={displayLines}
            title={t}
            author={a}
            theme={theme}
            isLong={isLong}
          />
        ) : (
          <HorizontalLayout
            lines={displayLines}
            title={t}
            author={a}
            theme={theme}
            isLong={isLong}
          />
        )}

        <Seal color={theme.seal} />
      </div>
    </CardFrame>
  )
})

function VerticalLayout({
  lines,
  title,
  author,
  theme,
  isLong,
}: {
  lines: string[]
  title: string
  author?: string
  theme: PoetryTheme
  isLong: boolean
}) {
  const verseSize = isLong ? 44 : 56
  return (
    <div
      style={{
        // basis 用 auto（auto 模式下卡片随内容长高），minHeight: 0 让固定
        // 尺寸下容器能被压回可用高度，竖排文字按真实可用高度换行，
        // 否则按 min-content 撑开、文字越过卡片下边缘（假性溢出提示）
        flex: '1 1 auto',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 56,
      }}
    >
      {title && (
        <div
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            fontFamily: '"Ma Shan Zheng", "Noto Serif SC Variable", serif',
            fontSize: 64,
            letterSpacing: '0.4em',
            color: theme.accent,
            marginTop: 20,
          }}
        >
          {title}
        </div>
      )}

      {lines.map((line, idx) => (
        <div
          key={idx}
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            fontFamily: '"Noto Serif SC Variable", serif',
            fontSize: verseSize,
            letterSpacing: '0.32em',
            lineHeight: 1.2,
            fontWeight: 500,
          }}
        >
          {line}
        </div>
      ))}

      {author && (
        <div
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            fontFamily: '"Noto Serif SC Variable", serif',
            fontSize: 22,
            letterSpacing: '0.3em',
            color: theme.accent,
            marginTop: 80,
          }}
        >
          —— {author}
        </div>
      )}
    </div>
  )
}

function HorizontalLayout({
  lines,
  title,
  author,
  theme,
  isLong,
}: {
  lines: string[]
  title: string
  author?: string
  theme: PoetryTheme
  isLong: boolean
}) {
  return (
    <div
      style={{
        // 同竖排：固定尺寸下允许收缩，超出时居中对称裁切而不是单边下坠
        flex: '1 1 auto',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: '"Ma Shan Zheng", serif',
            fontSize: 56,
            color: theme.accent,
            marginBottom: 40,
            letterSpacing: '0.2em',
          }}
        >
          {title}
        </div>
      )}
      {lines.map((line, idx) => (
        <div
          key={idx}
          style={{
            fontFamily: '"Noto Serif SC Variable", serif',
            fontSize: isLong ? 36 : 48,
            letterSpacing: '0.3em',
            lineHeight: 1.8,
          }}
        >
          {line}
        </div>
      ))}
      {author && (
        <div
          style={{
            marginTop: 40,
            fontFamily: '"Noto Serif SC Variable", serif',
            fontSize: 22,
            color: theme.accent,
            letterSpacing: '0.2em',
          }}
        >
          —— {author}
        </div>
      )}
    </div>
  )
}

function Seal({ color }: { color: string }) {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      style={{ position: 'absolute', right: 80, bottom: 80 }}
      aria-hidden
    >
      <rect
        x="3"
        y="3"
        width="84"
        height="84"
        rx="6"
        fill="none"
        stroke={color}
        strokeWidth="3"
      />
      <text
        x="50%"
        y="56%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontFamily='"Ma Shan Zheng", "Noto Serif SC Variable", serif'
        fontSize="52"
        letterSpacing="0"
      >
        閒
      </text>
    </svg>
  )
}

function InkWash({ color }: { color: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1080 1440"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, opacity: 0.9 }}
      aria-hidden
    >
      <defs>
        <radialGradient id="wash1" cx="20%" cy="15%" r="55%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="wash2" cx="85%" cy="92%" r="50%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#wash1)" />
      <rect width="100%" height="100%" fill="url(#wash2)" />
    </svg>
  )
}
