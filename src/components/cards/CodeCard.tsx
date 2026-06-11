import { forwardRef, useEffect, useState } from 'react'
import { CardFrame, type SizeMode } from '../CardFrame'
import type { CodeTheme } from '../../themes/codeThemes'
import { getHighlighter, resolveLang } from '../../lib/shiki'
import { detectLang, extractCodeFromFence } from '../../lib/detectLang'

interface Props {
  text: string
  theme: CodeTheme
  size: SizeMode
  filename?: string
}

export const CodeCard = forwardRef<HTMLDivElement, Props>(function CodeCard(
  { text, theme, size, filename },
  ref,
) {
  const { code, lang: fenceLang } = extractCodeFromFence(text)
  const lang = resolveLang(fenceLang) ?? detectLang(code)
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((h) => {
      try {
        const out = h.codeToHtml(code || '// 在此粘贴代码片段', {
          lang,
          theme: theme.shiki,
        })
        if (!cancelled) setHtml(out)
      } catch {
        const out = h.codeToHtml(code || '// paste code here', {
          lang: 'text',
          theme: theme.shiki,
        })
        if (!cancelled) setHtml(out)
      }
    })
    return () => {
      cancelled = true
    }
  }, [code, lang, theme.shiki])

  const padOuter = size === 'landscape' ? 100 : 80
  const fileLabel = filename || guessFilename(lang)

  return (
    <CardFrame ref={ref} size={size} background={theme.background}>
      <div className="noise-overlay" style={{ opacity: 0.08 }} />
      <div
        style={{
          position: 'relative',
          flex: '1 1 auto',
          minHeight: 0,
          padding: padOuter,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div
          style={{
            flex: '1 1 auto',
            background: 'rgba(15, 15, 22, 0.55)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: theme.glow,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* window chrome */}
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span style={dotStyle('#ff5f57')} />
            <span style={dotStyle('#febc2e')} />
            <span style={dotStyle('#28c840')} />
            <div
              style={{
                flex: 1,
                textAlign: 'center',
                color: theme.subtleColor,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 14,
                letterSpacing: '0.02em',
              }}
            >
              {fileLabel}
            </div>
            <span style={{ width: 60 }} />
          </div>

          {/* code body */}
          <div
            style={{
              padding: '28px 32px 36px',
              flex: 1,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 18,
              lineHeight: 1.6,
              color: theme.textColor,
              overflow: 'hidden',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: theme.subtleColor,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            letterSpacing: '0.04em',
          }}
        >
          <span>// text · card</span>
          <span>lang: {lang}</span>
        </div>
      </div>
    </CardFrame>
  )
})

function dotStyle(color: string): React.CSSProperties {
  return {
    width: 14,
    height: 14,
    borderRadius: 7,
    background: color,
    display: 'inline-block',
    boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.2)',
  }
}

function guessFilename(lang: string): string {
  const map: Record<string, string> = {
    typescript: 'snippet.ts',
    tsx: 'snippet.tsx',
    javascript: 'snippet.js',
    jsx: 'snippet.jsx',
    python: 'snippet.py',
    rust: 'snippet.rs',
    go: 'snippet.go',
    java: 'Snippet.java',
    cpp: 'snippet.cpp',
    c: 'snippet.c',
    csharp: 'Snippet.cs',
    html: 'index.html',
    css: 'style.css',
    json: 'data.json',
    yaml: 'config.yaml',
    bash: 'script.sh',
    shell: 'script.sh',
    markdown: 'note.md',
    sql: 'query.sql',
    ruby: 'snippet.rb',
    php: 'snippet.php',
    swift: 'snippet.swift',
    kotlin: 'snippet.kt',
  }
  return map[lang] ?? 'snippet.txt'
}
