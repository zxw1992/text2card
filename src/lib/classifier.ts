export type Style = 'code' | 'quote' | 'prose' | 'poetry'

const CODE_LINE_HINTS = [
  /^\s*(function|const|let|var|class|interface|type|export|import|return)\b/,
  /^\s*(def|class|import|from|if|elif|else|for|while|try|with)\b/,
  /^\s*(#include|using namespace|template|struct|public:|private:)\b/,
  /^\s*(package|func|var|const|type|import)\b/,
  /^\s*<\/?[a-zA-Z][\w-]*[^>]*>\s*$/,
  /[{};]\s*$/,
]

const MD_RE = /(^|\n)\s*(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|\|.*\|)/

const QUOTE_WRAPS = [
  /^["“「『][^]+["”」』]$/,
  /^['‘][^]+['’]$/,
]

const POETRY_LINE = /^[\s　]*[一-鿿]{4,9}[，。；？！,;?!]?[\s　]*$/
const POETRY_TITLE = /《[^》]+》/

export function classify(input: string): Style {
  const text = input.trim()
  if (!text) return 'quote'

  // 1) code fences or many code-like lines
  if (/```/.test(text)) return 'code'
  const lines = text.split('\n')
  const codeLineCount = lines
    .slice(0, 10)
    .filter((l) => CODE_LINE_HINTS.some((re) => re.test(l))).length
  if (codeLineCount >= 3) return 'code'
  if (codeLineCount >= 2 && lines.length <= 6) return 'code'

  // 2) classical poetry: short symmetric Chinese lines
  const nonEmptyLines = lines.filter((l) => l.trim().length > 0)
  if (nonEmptyLines.length >= 2 && nonEmptyLines.length <= 12) {
    const matched = nonEmptyLines.filter((l) => POETRY_LINE.test(l)).length
    if (matched >= Math.max(2, Math.floor(nonEmptyLines.length * 0.6))) {
      return 'poetry'
    }
  }
  if (POETRY_TITLE.test(text) && nonEmptyLines.length <= 14) return 'poetry'

  // 3) markdown structure or long prose
  if (MD_RE.test(text)) return 'prose'
  if (text.length > 300) return 'prose'

  // 4) quote: short, wrapped, or simply not long
  if (QUOTE_WRAPS.some((re) => re.test(text))) return 'quote'
  if (text.length <= 140 && lines.length <= 4) return 'quote'

  return 'prose'
}
