import hljs from 'highlight.js/lib/common'
import { SHIKI_LANGS, safeLang } from './shiki'

const HLJS_TO_SHIKI: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  rust: 'rust',
  go: 'go',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  csharp: 'csharp',
  xml: 'html',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  bash: 'bash',
  shell: 'shell',
  markdown: 'markdown',
  sql: 'sql',
  ruby: 'ruby',
  php: 'php',
  swift: 'swift',
  kotlin: 'kotlin',
}

export function detectLang(code: string, fallback = 'typescript'): string {
  if (!code.trim()) return fallback
  try {
    const result = hljs.highlightAuto(code, Object.keys(HLJS_TO_SHIKI))
    const mapped = result.language ? HLJS_TO_SHIKI[result.language] : null
    if (mapped && (SHIKI_LANGS as readonly string[]).includes(mapped)) return mapped
  } catch {
    /* noop */
  }
  return safeLang(fallback)
}

export function extractCodeFromFence(text: string): { code: string; lang?: string } {
  const fence = text.match(/^```(\w+)?\n([\s\S]*?)```\s*$/m)
  if (fence) {
    return { code: fence[2].trim(), lang: fence[1] }
  }
  return { code: text }
}
