import { forwardRef, useEffect, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CardFrame, type SizeMode } from '../CardFrame'
import type { ProseTheme } from '../../themes/proseThemes'
import { getHighlighter, resolveLang } from '../../lib/shiki'

interface Props {
  text: string
  theme: ProseTheme
  size: SizeMode
  title?: string
  eyebrow?: string
  signature?: string
  compact?: boolean
}

export const ProseCard = forwardRef<HTMLDivElement, Props>(function ProseCard(
  { text, theme, size, title, eyebrow, signature, compact },
  ref,
) {
  const padX = size === 'landscape' ? 140 : 96
  const padY = size === 'landscape' ? 90 : 96

  return (
    <CardFrame ref={ref} size={size} background={theme.background} compact={compact}>
      <div className="noise-overlay" style={{ opacity: 0.05 }} />
      <div
        style={{
          position: 'relative',
          flex: '1 1 auto',
          minHeight: 0,
          padding: `${padY}px ${padX}px`,
          display: 'flex',
          flexDirection: 'column',
          color: theme.text,
        }}
      >
        {(eyebrow || title) && (
          <header style={{ marginBottom: 40 }}>
            {eyebrow && (
              <div
                style={{
                  color: theme.accent,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 18,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <h1
                style={{
                  fontFamily: '"Fraunces Variable", "Noto Serif SC Variable", serif',
                  fontSize: 64,
                  lineHeight: 1.15,
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: '-0.015em',
                }}
              >
                {title}
              </h1>
            )}
            <div
              style={{
                marginTop: 32,
                height: 1,
                background: theme.rule,
              }}
            />
          </header>
        )}

        <article
          style={{
            flex: 1,
            fontFamily: '"Fraunces Variable", "Noto Serif SC Variable", serif',
            fontSize: 24,
            lineHeight: 1.75,
            color: theme.text,
            overflow: 'hidden',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={mdComponents(theme)}
          >
            {text || '在此粘贴你的笔记、文章或 Markdown 内容……'}
          </ReactMarkdown>
        </article>

        <footer
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${theme.rule}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: theme.muted,
            fontFamily: '"Inter", sans-serif',
            fontSize: 18,
            letterSpacing: '0.05em',
          }}
        >
          <span>{signature || 'text · card'}</span>
          <span style={{ color: theme.accent, fontWeight: 600 }}>✦</span>
        </footer>
      </div>
    </CardFrame>
  )
})

function mdComponents(theme: ProseTheme): Components {
  return {
    h1: ({ children }) => (
      <h2
        style={{
          fontFamily: '"Fraunces Variable", "Noto Serif SC Variable", serif',
          fontSize: 44,
          lineHeight: 1.2,
          fontWeight: 600,
          margin: '32px 0 16px',
          letterSpacing: '-0.01em',
        }}
      >
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h3
        style={{
          fontFamily: '"Fraunces Variable", "Noto Serif SC Variable", serif',
          fontSize: 34,
          lineHeight: 1.25,
          fontWeight: 600,
          margin: '28px 0 12px',
          paddingLeft: 16,
          borderLeft: `4px solid ${theme.accent}`,
        }}
      >
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4
        style={{
          fontFamily: '"Fraunces Variable", "Noto Serif SC Variable", serif',
          fontSize: 26,
          lineHeight: 1.3,
          fontWeight: 600,
          margin: '24px 0 10px',
          color: theme.accent,
        }}
      >
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p style={{ margin: '0 0 18px' }}>{children}</p>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        style={{
          color: theme.accent,
          textDecoration: 'underline',
          textUnderlineOffset: 4,
        }}
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          margin: '24px 0',
          padding: '6px 0 6px 24px',
          borderLeft: `4px solid ${theme.accent}`,
          fontStyle: 'italic',
          color: theme.muted,
        }}
      >
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul style={{ margin: '0 0 18px', paddingLeft: 28 }}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol style={{ margin: '0 0 18px', paddingLeft: 28 }}>{children}</ol>
    ),
    li: ({ children }) => (
      <li style={{ margin: '6px 0' }}>{children}</li>
    ),
    hr: () => (
      <hr
        style={{
          border: 0,
          borderTop: `1px solid ${theme.rule}`,
          margin: '32px 0',
        }}
      />
    ),
    code: ({ className, children, ...props }: any) => {
      const language = /language-(\w+)/.exec(className || '')?.[1]
      const raw = String(children).replace(/\n$/, '')
      // react-markdown v9 不再传 inline；块级代码的文本固定以 \n 结尾，行内代码不含 \n
      const isBlock = !!language || String(children).includes('\n')
      if (!isBlock) {
        return (
          <code
            style={{
              background: theme.inlineCodeBg,
              padding: '2px 8px',
              borderRadius: 6,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.88em',
            }}
            {...props}
          >
            {children}
          </code>
        )
      }
      return (
        <ProseCodeBlock code={raw} lang={resolveLang(language) ?? 'text'} theme={theme} />
      )
    },
    pre: ({ children }) => <>{children}</>,
  }
}

function ProseCodeBlock({
  code,
  lang,
  theme,
}: {
  code: string
  lang: string
  theme: ProseTheme
}) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    let cancelled = false
    getHighlighter().then((h) => {
      try {
        const out = h.codeToHtml(code, { lang, theme: theme.shikiTheme })
        if (!cancelled) setHtml(out)
      } catch {
        const out = h.codeToHtml(code, { lang: 'text', theme: theme.shikiTheme })
        if (!cancelled) setHtml(out)
      }
    })
    return () => {
      cancelled = true
    }
  }, [code, lang, theme.shikiTheme])

  return (
    <div
      style={{
        background: theme.codeBg,
        padding: '20px 24px',
        borderRadius: 12,
        margin: '20px 0',
        fontSize: 18,
        fontFamily: '"JetBrains Mono", monospace',
        lineHeight: 1.55,
        overflow: 'hidden',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
