export interface ProseTheme {
  name: string
  background: string
  text: string
  muted: string
  accent: string
  rule: string
  codeBg: string
  inlineCodeBg: string
  shikiTheme: string
}

export const proseThemes: ProseTheme[] = [
  {
    name: '素白',
    background: 'linear-gradient(180deg, #ffffff 0%, #f6f4ef 100%)',
    text: '#1f1c18',
    muted: '#7a7568',
    accent: '#b85a3a',
    rule: 'rgba(31, 28, 24, 0.12)',
    codeBg: '#f4f2ec',
    inlineCodeBg: '#ecebe4',
    shikiTheme: 'min-light',
  },
  {
    name: '米黄',
    background: 'linear-gradient(180deg, #faf3e1 0%, #efe3c4 100%)',
    text: '#2a2418',
    muted: '#7d6f4e',
    accent: '#9c5a1a',
    rule: 'rgba(42, 36, 24, 0.14)',
    codeBg: '#f4ead0',
    inlineCodeBg: '#ecdfbc',
    shikiTheme: 'min-light',
  },
  {
    name: '深褐',
    background: 'linear-gradient(180deg, #20180f 0%, #2e2419 100%)',
    text: '#e9e0cc',
    muted: '#a39376',
    accent: '#e6b577',
    rule: 'rgba(233, 224, 204, 0.18)',
    codeBg: '#1a130a',
    inlineCodeBg: '#3a2e1f',
    shikiTheme: 'github-dark',
  },
]
