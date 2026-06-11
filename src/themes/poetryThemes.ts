export interface PoetryTheme {
  name: string
  background: string
  text: string
  accent: string
  seal: string
  wash: string
}

export const poetryThemes: PoetryTheme[] = [
  {
    name: '宣纸',
    background:
      'radial-gradient(at 30% 20%, #f9efd8 0%, transparent 55%), linear-gradient(135deg, #f4ecd8 0%, #e8dcbf 100%)',
    text: '#2a221a',
    accent: '#5a4a36',
    seal: '#b8332a',
    wash: 'rgba(60, 50, 35, 0.08)',
  },
  {
    name: '青绿山水',
    background:
      'radial-gradient(at 20% 80%, #b6cbb0 0%, transparent 60%), radial-gradient(at 85% 15%, #e6dcb8 0%, transparent 55%), linear-gradient(135deg, #ebe5cb 0%, #c8d4b8 100%)',
    text: '#1f2c20',
    accent: '#3d5a44',
    seal: '#a8302a',
    wash: 'rgba(31, 44, 32, 0.1)',
  },
  {
    name: '墨竹',
    background:
      'radial-gradient(at 70% 70%, #d8d2bd 0%, transparent 55%), linear-gradient(135deg, #ebe4cc 0%, #cfc5a8 100%)',
    text: '#1c1a14',
    accent: '#3a342a',
    seal: '#a8302a',
    wash: 'rgba(28, 26, 20, 0.12)',
  },
]
