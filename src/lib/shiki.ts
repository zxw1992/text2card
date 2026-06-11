import { createHighlighter, type Highlighter } from 'shiki'

export const SHIKI_THEMES = [
  'one-dark-pro',
  'nord',
  'github-dark',
  'catppuccin-mocha',
  'solarized-dark',
  'tokyo-night',
  'github-light',
  'min-light',
] as const

export const SHIKI_LANGS = [
  'javascript',
  'typescript',
  'tsx',
  'jsx',
  'python',
  'rust',
  'go',
  'java',
  'cpp',
  'c',
  'csharp',
  'html',
  'css',
  'json',
  'yaml',
  'bash',
  'shell',
  'markdown',
  'sql',
  'ruby',
  'php',
  'swift',
  'kotlin',
] as const

let cache: Promise<Highlighter> | null = null

export function getHighlighter(): Promise<Highlighter> {
  if (!cache) {
    cache = createHighlighter({
      themes: [...SHIKI_THEMES],
      langs: [...SHIKI_LANGS],
    })
  }
  return cache
}

export function safeLang(lang: string): string {
  return (SHIKI_LANGS as readonly string[]).includes(lang) ? lang : 'text'
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
  return (SHIKI_LANGS as readonly string[]).includes(mapped) ? mapped : null
}
