import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, Eye, Github, Pencil, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'
import { Controls } from './components/Controls'
import { CodeCard } from './components/cards/CodeCard'
import { QuoteCard } from './components/cards/QuoteCard'
import { ProseCard } from './components/cards/ProseCard'
import { PoetryCard } from './components/cards/PoetryCard'
import { classify, type Style } from './lib/classifier'
import { exportPng } from './lib/exporter'
import type { SizeMode } from './components/CardFrame'
import { codeThemes } from './themes/codeThemes'
import { quoteThemes } from './themes/quoteThemes'
import { proseThemes } from './themes/proseThemes'
import { poetryThemes } from './themes/poetryThemes'

const DEFAULT_TEXT = '愿你慢慢长大，愿你有好运气，如果没有，愿你在不幸中学会慈悲。'

// 自动保存：编辑状态持久化到 localStorage，刷新/标签页被浏览器回收后不丢内容
const STORAGE_KEY = 'text2card.state.v1'

interface PersistedState {
  text: string
  styleChoice: Style | 'auto'
  size: SizeMode
  themeIndex: number
  title: string
  author: string
  eyebrow: string
  vertical: boolean
}

function loadPersisted(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as Partial<PersistedState>
    return typeof data === 'object' && data !== null ? data : {}
  } catch {
    return {}
  }
}

const STYLE_OPTIONS: { value: Style | 'auto'; label: string }[] = [
  { value: 'auto', label: '自动' },
  { value: 'code', label: '代码' },
  { value: 'quote', label: '金句' },
  { value: 'prose', label: '长文' },
  { value: 'poetry', label: '诗词' },
]

const SIZE_OPTIONS: { value: SizeMode; label: string }[] = [
  { value: 'auto', label: '自适应' },
  { value: 'portrait', label: '3 : 4' },
  { value: 'landscape', label: '16 : 9' },
]

export default function App() {
  const [persisted] = useState(loadPersisted)
  const [text, setText] = useState(persisted.text ?? DEFAULT_TEXT)
  const [styleChoice, setStyleChoice] = useState<Style | 'auto'>(
    STYLE_OPTIONS.some((o) => o.value === persisted.styleChoice) ? persisted.styleChoice! : 'auto',
  )
  const [size, setSize] = useState<SizeMode>(
    SIZE_OPTIONS.some((o) => o.value === persisted.size) ? persisted.size! : 'auto',
  )
  const [themeIndex, setThemeIndex] = useState(
    typeof persisted.themeIndex === 'number' && persisted.themeIndex >= 0 ? persisted.themeIndex : 0,
  )
  const [title, setTitle] = useState(persisted.title ?? '')
  const [author, setAuthor] = useState(persisted.author ?? '')
  const [eyebrow, setEyebrow] = useState(persisted.eyebrow ?? '')
  const [vertical, setVertical] = useState(persisted.vertical ?? true)
  const [exporting, setExporting] = useState(false)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview' | 'style'>('edit')

  const detected = useMemo(() => classify(text), [text])
  const effective: Style = styleChoice === 'auto' ? detected : styleChoice

  const cardRef = useRef<HTMLDivElement>(null)

  // 生效风格变化（含 auto 检测切换）时重置主题索引，避免停留在上个风格的主题位。
  // 用前值比较而不是「跳过首次」：StrictMode 下挂载效果会执行两次，
  // 布尔守卫第二次就会误触发，把刚从 localStorage 恢复的主题索引清零。
  const prevEffective = useRef(effective)
  useEffect(() => {
    if (prevEffective.current !== effective) {
      prevEffective.current = effective
      setThemeIndex(0)
    }
  }, [effective])

  // 编辑状态自动保存（轻微防抖，避免每个按键都写 localStorage）
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const state: PersistedState = { text, styleChoice, size, themeIndex, title, author, eyebrow, vertical }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch {
        // localStorage 不可用（隐私模式/配额满）时静默放弃自动保存
      }
    }, 300)
    return () => clearTimeout(id)
  }, [text, styleChoice, size, themeIndex, title, author, eyebrow, vertical])

  function handleStyleChange(next: Style | 'auto') {
    setStyleChoice(next)
  }

  async function handleExport() {
    if (!cardRef.current) return
    try {
      setExporting(true)
      const name = `text2card-${effective}-${Date.now()}.png`
      await exportPng(cardRef.current, name)
    } catch (err) {
      console.error('export failed:', err)
      alert(`导出失败：${err instanceof Error ? err.message : String(err)}\n可尝试刷新页面后重试。`)
    } finally {
      setExporting(false)
    }
  }

  const card = renderCard({
    style: effective,
    text,
    themeIndex,
    size,
    title,
    author,
    eyebrow,
    vertical,
    cardRef,
  })

  const stylePill = (
    <div className="flex items-center gap-1 rounded-full border border-ink-200 bg-white p-1 text-sm">
      {STYLE_OPTIONS.map((opt) => {
        const isActive = styleChoice === opt.value
        const isAutoSuggesting = opt.value === 'auto' && styleChoice === 'auto'
        return (
          <button
            key={opt.value}
            onClick={() => handleStyleChange(opt.value)}
            className={`relative whitespace-nowrap rounded-full px-3 py-1.5 transition ${
              isActive ? 'bg-ink-800 text-white' : 'text-ink-600 hover:text-ink-800'
            }`}
          >
            {opt.label}
            {isAutoSuggesting && (
              <span className="ml-1 text-xs opacity-75">· {labelOf(detected)}</span>
            )}
          </button>
        )
      })}
    </div>
  )

  const sizePill = (
    <div className="flex items-center gap-1 rounded-full border border-ink-200 bg-white p-1 text-sm">
      {SIZE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setSize(opt.value)}
          className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${
            size === opt.value ? 'bg-ink-800 text-white' : 'text-ink-600 hover:text-ink-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )

  const MOBILE_TABS = [
    { value: 'edit', label: '编辑', icon: Pencil },
    { value: 'preview', label: '预览', icon: Eye },
    { value: 'style', label: '调整', icon: SlidersHorizontal },
  ] as const

  return (
    <div className="flex h-screen flex-col bg-[var(--canvas-bg)]">
      <header className="flex items-center justify-between gap-3 border-b border-ink-200/60 bg-white/70 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-ink-700" />
          <span className="font-serif text-xl font-semibold text-ink-800">text2card</span>
          <span className="hidden text-xs text-ink-400 md:inline">文案卡片美化</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-3 md:flex">
            {stylePill}
            {sizePill}
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-full bg-ink-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink-900 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span className="whitespace-nowrap">{exporting ? '导出中…' : '导出 PNG'}</span>
          </button>

          <a
            href="https://github.com/zxw1992/text2card"
            target="_blank"
            rel="noreferrer"
            title="在 GitHub 上查看源码"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition hover:border-ink-300 hover:text-ink-800"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* 移动端：风格 / 尺寸切换条（横向可滚动）；桌面端这些控件在 header 内，此条隐藏 */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-ink-200/60 bg-white/50 px-4 py-2 md:hidden">
        {stylePill}
        {sizePill}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Editor
          value={text}
          onChange={setText}
          className={`${mobileTab === 'edit' ? 'flex' : 'hidden'} md:flex`}
        />
        <Preview
          size={size}
          className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex`}
        >
          {card}
        </Preview>
        <Controls
          className={`${mobileTab === 'style' ? 'flex' : 'hidden'} md:flex`}
          style={effective}
          themeIndex={themeIndex}
          onThemeIndex={setThemeIndex}
          title={title}
          onTitle={setTitle}
          author={author}
          onAuthor={setAuthor}
          eyebrow={eyebrow}
          onEyebrow={setEyebrow}
          vertical={vertical}
          onVertical={setVertical}
        />
      </div>

      {/* 移动端底部 Tab：编辑 / 预览 / 调整 */}
      <nav className="flex border-t border-ink-200/60 bg-white/80 backdrop-blur md:hidden">
        {MOBILE_TABS.map((t) => {
          const Icon = t.icon
          const active = mobileTab === t.value
          return (
            <button
              key={t.value}
              onClick={() => setMobileTab(t.value)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition ${
                active ? 'text-ink-900' : 'text-ink-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              {t.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function labelOf(s: Style): string {
  return { code: '代码', quote: '金句', prose: '长文', poetry: '诗词' }[s]
}

function renderCard({
  style,
  text,
  themeIndex,
  size,
  title,
  author,
  eyebrow,
  vertical,
  cardRef,
}: {
  style: Style
  text: string
  themeIndex: number
  size: SizeMode
  title: string
  author: string
  eyebrow: string
  vertical: boolean
  cardRef: React.RefObject<HTMLDivElement>
}) {
  const safeIdx = (arr: any[]) => arr[Math.min(themeIndex, arr.length - 1)]
  switch (style) {
    case 'code':
      return (
        <CodeCard
          ref={cardRef}
          text={text}
          theme={safeIdx(codeThemes)}
          size={size}
          filename={title || undefined}
        />
      )
    case 'quote':
      return (
        <QuoteCard
          ref={cardRef}
          text={text}
          theme={safeIdx(quoteThemes)}
          size={size}
          author={author || undefined}
        />
      )
    case 'prose':
      return (
        <ProseCard
          ref={cardRef}
          text={text}
          theme={safeIdx(proseThemes)}
          size={size}
          title={title || undefined}
          eyebrow={eyebrow || undefined}
          signature={author || undefined}
        />
      )
    case 'poetry':
      return (
        <PoetryCard
          ref={cardRef}
          text={text}
          theme={safeIdx(poetryThemes)}
          size={size}
          title={title || undefined}
          author={author || undefined}
          vertical={vertical}
        />
      )
  }
}
