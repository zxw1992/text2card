import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

// 用 core + 显式引入代替 full bundle，避免把全部语言/主题打进 dist。
// 主题以 themes/codeThemes.ts、themes/proseThemes.ts 实际引用为准。
const THEME_IMPORTS = {
  'one-dark-pro': () => import('shiki/themes/one-dark-pro.mjs'),
  nord: () => import('shiki/themes/nord.mjs'),
  'github-dark': () => import('shiki/themes/github-dark.mjs'),
  'catppuccin-mocha': () => import('shiki/themes/catppuccin-mocha.mjs'),
  'solarized-dark': () => import('shiki/themes/solarized-dark.mjs'),
  'tokyo-night': () => import('shiki/themes/tokyo-night.mjs'),
  'min-light': () => import('shiki/themes/min-light.mjs'),
} as const

const LANG_IMPORTS = {
  javascript: () => import('shiki/langs/javascript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  cpp: () => import('shiki/langs/cpp.mjs'),
  c: () => import('shiki/langs/c.mjs'),
  csharp: () => import('shiki/langs/csharp.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  shell: () => import('shiki/langs/shell.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  ruby: () => import('shiki/langs/ruby.mjs'),
  php: () => import('shiki/langs/php.mjs'),
  swift: () => import('shiki/langs/swift.mjs'),
  kotlin: () => import('shiki/langs/kotlin.mjs'),
} as const

export const SHIKI_LANGS = Object.keys(LANG_IMPORTS) as readonly string[]

let cache: Promise<HighlighterCore> | null = null

export function getHighlighter(): Promise<HighlighterCore> {
  if (!cache) {
    cache = createHighlighterCore({
      themes: Object.values(THEME_IMPORTS).map((load) => load()),
      langs: Object.values(LANG_IMPORTS).map((load) => load()),
      engine: createOnigurumaEngine(import('shiki/wasm')),
    })
  }
  return cache
}

export function safeLang(lang: string): string {
  return SHIKI_LANGS.includes(lang) ? lang : 'text'
}

const LANG_ALIASES: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  golang: 'go',
  kt: 'kotlin',
  sh: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  'c++': 'cpp',
  cs: 'csharp',
  htm: 'html',
  xml: 'html',
}

/** 把围栏语言（含 js/py/sh 等别名）解析成 Shiki 支持的语言；解析不了返回 null */
export function resolveLang(lang?: string | null): string | null {
  if (!lang) return null
  const lower = lang.toLowerCase()
  const mapped = LANG_ALIASES[lower] ?? lower
  return SHIKI_LANGS.includes(mapped) ? mapped : null
}
