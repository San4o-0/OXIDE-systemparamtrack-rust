export type ThemeName = 'oxide' | 'paper'

export interface ChartTheme {
  grid: string
  axis: string
  panel: string
  ink: string
}

export const CHART_THEME: Record<ThemeName, ChartTheme> = {
  oxide: {
    grid: '#2e343a',
    axis: '#5c646c',
    panel: '#14171a',
    ink: '#e8e6e1',
  },
  paper: {
    grid: '#cfc9bb',
    axis: '#9a9384',
    panel: '#f5f3ee',
    ink: '#23262b',
  },
}

export const THEME_KEY = 'oxide.theme'

export function readTheme(): ThemeName {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'paper' ? 'paper' : 'oxide'
  } catch {
    return 'oxide'
  }
}
