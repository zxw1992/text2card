import type { Style } from '../lib/classifier'
import { SIZE_OPTIONS, type SizeMode } from './CardFrame'
import { codeThemes } from '../themes/codeThemes'
import { quoteThemes } from '../themes/quoteThemes'
import { proseThemes } from '../themes/proseThemes'
import { poetryThemes } from '../themes/poetryThemes'

interface Props {
  className?: string
  style: Style
  size: SizeMode
  onSize: (s: SizeMode) => void
  compact: boolean
  onCompact: (v: boolean) => void
  themeIndex: number
  onThemeIndex: (n: number) => void
  title: string
  onTitle: (s: string) => void
  author: string
  onAuthor: (s: string) => void
  eyebrow: string
  onEyebrow: (s: string) => void
  vertical: boolean
  onVertical: (v: boolean) => void
}

export function Controls({
  className = '',
  style,
  size,
  onSize,
  compact,
  onCompact,
  themeIndex,
  onThemeIndex,
  title,
  onTitle,
  author,
  onAuthor,
  eyebrow,
  onEyebrow,
  vertical,
  onVertical,
}: Props) {
  const themes = pickThemes(style)

  return (
    <aside className={`h-full w-full shrink-0 flex-col gap-6 overflow-y-auto border-l border-ink-200/60 bg-white/60 p-5 backdrop-blur md:w-[320px] ${className}`}>
      <Section title="尺寸">
        <div className="flex rounded-md border border-ink-200 p-0.5 text-sm">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSize(opt.value)}
              className={`flex-1 rounded px-2 py-1.5 transition ${
                size === opt.value ? 'bg-ink-800 text-white' : 'text-ink-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {size === 'auto' && (
        <Section title="留白">
          <div className="flex rounded-md border border-ink-200 p-0.5 text-sm">
            <button
              onClick={() => onCompact(false)}
              className={`flex-1 rounded px-2 py-1.5 transition ${
                !compact ? 'bg-ink-800 text-white' : 'text-ink-600'
              }`}
            >
              标准
            </button>
            <button
              onClick={() => onCompact(true)}
              className={`flex-1 rounded px-2 py-1.5 transition ${
                compact ? 'bg-ink-800 text-white' : 'text-ink-600'
              }`}
            >
              紧凑
            </button>
          </div>
        </Section>
      )}

      <Section title="主题">
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t, i) => (
            <button
              key={t.name + i}
              onClick={() => onThemeIndex(i)}
              className={`group relative overflow-hidden rounded-lg border text-left transition ${
                i === themeIndex
                  ? 'border-ink-800 shadow-sm'
                  : 'border-ink-200 hover:border-ink-400'
              }`}
            >
              <div className="h-12 w-full" style={{ background: t.background }}>
                {t.code && (
                  // 代码主题：用主题自身颜色画迷你「代码行」，比纯底色更能预判配色
                  <div className="flex h-full flex-col justify-center gap-[3px] px-2.5">
                    <span className="h-[3px] rounded-full" style={{ width: '38%', background: t.code.accent }} />
                    <span className="h-[3px] rounded-full" style={{ width: '72%', background: t.code.text, opacity: 0.85 }} />
                    <span className="h-[3px] rounded-full" style={{ width: '54%', background: t.code.subtle }} />
                  </div>
                )}
              </div>
              <div className="px-2 py-1.5 text-xs text-ink-700">{t.name}</div>
            </button>
          ))}
        </div>
      </Section>

      {style === 'code' && (
        <Section title="文件名">
          <Input value={title} onChange={onTitle} placeholder="snippet.ts" />
        </Section>
      )}

      {style === 'quote' && (
        <Section title="署名">
          <Input value={author} onChange={onAuthor} placeholder="—— 作者（可空）" />
        </Section>
      )}

      {style === 'prose' && (
        <>
          <Section title="眉头标签">
            <Input value={eyebrow} onChange={onEyebrow} placeholder="NOTES · 2026" />
          </Section>
          <Section title="标题">
            <Input value={title} onChange={onTitle} placeholder="一段标题" />
          </Section>
          <Section title="署名">
            <Input value={author} onChange={onAuthor} placeholder="via @you" />
          </Section>
        </>
      )}

      {style === 'poetry' && (
        <>
          <Section title="标题">
            <Input value={title} onChange={onTitle} placeholder="题目" />
          </Section>
          <Section title="作者">
            <Input value={author} onChange={onAuthor} placeholder="作者朝代" />
          </Section>
          <Section title="排版">
            <div className="flex rounded-md border border-ink-200 p-0.5 text-sm">
              <button
                onClick={() => onVertical(true)}
                className={`flex-1 rounded px-2 py-1.5 transition ${
                  vertical ? 'bg-ink-800 text-white' : 'text-ink-600'
                }`}
              >
                竖排
              </button>
              <button
                onClick={() => onVertical(false)}
                className={`flex-1 rounded px-2 py-1.5 transition ${
                  !vertical ? 'bg-ink-800 text-white' : 'text-ink-600'
                }`}
              >
                横排
              </button>
            </div>
          </Section>
        </>
      )}
    </aside>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-400">
        {title}
      </div>
      {children}
    </section>
  )
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 outline-none transition placeholder:text-ink-300 focus:border-ink-600"
    />
  )
}

interface ThemeSwatch {
  name: string
  background: string
  code?: { text: string; subtle: string; accent: string }
}

function pickThemes(style: Style): ThemeSwatch[] {
  switch (style) {
    case 'code':
      return codeThemes.map((t) => ({
        name: t.name,
        background: t.background,
        code: { text: t.textColor, subtle: t.subtleColor, accent: t.accent },
      }))
    case 'quote':
      return quoteThemes.map((t) => ({ name: t.name, background: t.background }))
    case 'prose':
      return proseThemes.map((t) => ({ name: t.name, background: t.background }))
    case 'poetry':
      return poetryThemes.map((t) => ({ name: t.name, background: t.background }))
  }
}
