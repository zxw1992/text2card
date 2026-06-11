export interface QuoteTheme {
  name: string
  background: string
  text: string
  accent: string
  rule: string
  quoteMark: string
  noise: number
}

export const quoteThemes: QuoteTheme[] = [
  {
    name: '暖阳',
    background:
      'radial-gradient(at 20% 10%, #fde7c1 0%, transparent 55%), radial-gradient(at 85% 90%, #f3a6b4 0%, transparent 55%), linear-gradient(135deg, #fff6e6 0%, #f8d9bf 100%)',
    text: '#3d2718',
    accent: '#b85a3a',
    rule: 'rgba(61, 39, 24, 0.18)',
    quoteMark: 'rgba(184, 90, 58, 0.16)',
    noise: 0.07,
  },
  {
    name: '午夜蓝',
    background:
      'radial-gradient(at 80% 20%, #4a5bd4 0%, transparent 50%), radial-gradient(at 20% 80%, #1a2a6c 0%, transparent 55%), linear-gradient(135deg, #0e1430 0%, #1c2454 100%)',
    text: '#f1ecdc',
    accent: '#d4b075',
    rule: 'rgba(241, 236, 220, 0.25)',
    quoteMark: 'rgba(212, 176, 117, 0.22)',
    noise: 0.09,
  },
  {
    name: '晨雾绿',
    background:
      'radial-gradient(at 30% 100%, #b8d4c0 0%, transparent 55%), radial-gradient(at 80% 0%, #e8e2cf 0%, transparent 55%), linear-gradient(135deg, #f3efe2 0%, #d8d6c2 100%)',
    text: '#2c3a32',
    accent: '#4a6b54',
    rule: 'rgba(44, 58, 50, 0.2)',
    quoteMark: 'rgba(74, 107, 84, 0.18)',
    noise: 0.06,
  },
  {
    name: '莓粉',
    background:
      'radial-gradient(at 25% 30%, #ffd5e1 0%, transparent 55%), radial-gradient(at 80% 80%, #d68fa8 0%, transparent 55%), linear-gradient(135deg, #fff0f4 0%, #f0c4d2 100%)',
    text: '#4a1e2e',
    accent: '#b8456e',
    rule: 'rgba(74, 30, 46, 0.18)',
    quoteMark: 'rgba(184, 69, 110, 0.18)',
    noise: 0.07,
  },
]
