export interface CodeTheme {
  name: string
  shiki: string
  background: string
  glow: string
  accent: string
  windowChrome: 'dots' | 'plain'
  textColor: string
  subtleColor: string
}

export const codeThemes: CodeTheme[] = [
  {
    name: 'One Dark Pro',
    shiki: 'one-dark-pro',
    background:
      'radial-gradient(at 20% 0%, #4a3a8a 0%, transparent 45%), radial-gradient(at 80% 100%, #d44d8a 0%, transparent 45%), linear-gradient(135deg, #1b1535 0%, #2a1f4c 100%)',
    glow: '0 30px 80px -20px rgba(75, 50, 150, 0.55), 0 0 0 1px rgba(255,255,255,0.04)',
    accent: '#c678dd',
    windowChrome: 'dots',
    textColor: '#e8e4f0',
    subtleColor: 'rgba(232, 228, 240, 0.45)',
  },
  {
    name: 'Nord',
    shiki: 'nord',
    background:
      'radial-gradient(at 0% 0%, #5e81ac 0%, transparent 50%), radial-gradient(at 100% 100%, #88c0d0 0%, transparent 45%), linear-gradient(135deg, #1a2230 0%, #2e3440 100%)',
    glow: '0 30px 80px -20px rgba(94, 129, 172, 0.55), 0 0 0 1px rgba(255,255,255,0.05)',
    accent: '#88c0d0',
    windowChrome: 'dots',
    textColor: '#e5e9f0',
    subtleColor: 'rgba(229, 233, 240, 0.45)',
  },
  {
    name: 'GitHub Dark',
    shiki: 'github-dark',
    background:
      'radial-gradient(at 100% 0%, #1f6feb 0%, transparent 45%), radial-gradient(at 0% 100%, #6e40c9 0%, transparent 45%), linear-gradient(135deg, #0a0f1c 0%, #161b22 100%)',
    glow: '0 30px 80px -20px rgba(31, 111, 235, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    accent: '#58a6ff',
    windowChrome: 'dots',
    textColor: '#c9d1d9',
    subtleColor: 'rgba(201, 209, 217, 0.45)',
  },
  {
    name: 'Catppuccin Mocha',
    shiki: 'catppuccin-mocha',
    background:
      'radial-gradient(at 30% 0%, #f5c2e7 0%, transparent 50%), radial-gradient(at 70% 100%, #cba6f7 0%, transparent 45%), linear-gradient(135deg, #11111b 0%, #1e1e2e 100%)',
    glow: '0 30px 80px -20px rgba(203, 166, 247, 0.45), 0 0 0 1px rgba(255,255,255,0.05)',
    accent: '#f5c2e7',
    windowChrome: 'dots',
    textColor: '#cdd6f4',
    subtleColor: 'rgba(205, 214, 244, 0.5)',
  },
  {
    name: 'Solarized Dark',
    shiki: 'solarized-dark',
    background:
      'radial-gradient(at 15% 15%, #b58900 0%, transparent 45%), radial-gradient(at 90% 90%, #2aa198 0%, transparent 50%), linear-gradient(135deg, #001f27 0%, #002b36 100%)',
    glow: '0 30px 80px -20px rgba(181, 137, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05)',
    accent: '#b58900',
    windowChrome: 'dots',
    textColor: '#93a1a1',
    subtleColor: 'rgba(147, 161, 161, 0.5)',
  },
  {
    name: 'Tokyo Night',
    shiki: 'tokyo-night',
    background:
      'radial-gradient(at 25% 10%, #7aa2f7 0%, transparent 45%), radial-gradient(at 80% 90%, #bb9af7 0%, transparent 50%), linear-gradient(135deg, #16161e 0%, #1a1b26 100%)',
    glow: '0 30px 80px -20px rgba(122, 162, 247, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    accent: '#7aa2f7',
    windowChrome: 'dots',
    textColor: '#c0caf5',
    subtleColor: 'rgba(192, 202, 245, 0.5)',
  },
]
