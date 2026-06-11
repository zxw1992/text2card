import { forwardRef } from 'react'
import { CardFrame, type SizeMode } from '../CardFrame'
import type { QuoteTheme } from '../../themes/quoteThemes'

interface Props {
  text: string
  author?: string
  theme: QuoteTheme
  size: SizeMode
}

function pickFontSize(textLen: number, size: SizeMode): number {
  // tuned for width 1080
  const base = size === 'landscape' ? 56 : 64
  if (textLen <= 30) return base + 16
  if (textLen <= 80) return base
  if (textLen <= 160) return base - 12
  if (textLen <= 280) return base - 22
  return base - 28
}

export const QuoteCard = forwardRef<HTMLDivElement, Props>(function QuoteCard(
  { text, author, theme, size },
  ref,
) {
  const fontSize = pickFontSize(text.length, size)
  return (
    <CardFrame ref={ref} size={size} background={theme.background}>
      <div
        className="noise-overlay"
        style={{ opacity: theme.noise, mixBlendMode: 'overlay' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: size === 'landscape' ? '100px 140px' : '120px 100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: theme.text,
        }}
      >
        <svg
          width="120"
          height="100"
          viewBox="0 0 120 100"
          fill={theme.quoteMark}
          style={{ marginBottom: 24 }}
          aria-hidden
        >
          <path d="M30 80 C 12 80 0 65 0 45 C 0 22 14 6 36 0 L 40 14 C 28 18 22 26 22 36 C 28 34 36 38 40 46 C 44 56 38 70 30 80 Z" />
          <path d="M90 80 C 72 80 60 65 60 45 C 60 22 74 6 96 0 L 100 14 C 88 18 82 26 82 36 C 88 34 96 38 100 46 C 104 56 98 70 90 80 Z" />
        </svg>

        <p
          style={{
            fontFamily: '"Fraunces", "Noto Serif SC", serif',
            fontSize,
            lineHeight: 1.45,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {text || '在此输入一段值得保存的句子……'}
        </p>

        <div
          style={{
            marginTop: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <span
            style={{
              display: 'block',
              width: 60,
              height: 2,
              background: theme.accent,
              borderRadius: 1,
            }}
          />
          <span
            style={{
              fontFamily: '"Inter", "Noto Serif SC", sans-serif',
              fontSize: 22,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: theme.accent,
              fontWeight: 600,
            }}
          >
            {author || 'text · card'}
          </span>
        </div>
      </div>
    </CardFrame>
  )
})
