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
