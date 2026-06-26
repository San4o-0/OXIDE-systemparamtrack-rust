export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(value >= 100 || i === 0 ? 0 : 1)} ${units[i]}`
}

/** Рампа окислення: метал нагрівається з навантаженням. */
export function formatRate(bytesPerSec: number): string {
  return `${formatBytes(bytesPerSec)}/с`
}

export const OXIDE = {
  patina: '#3fb6a8', // холодний простій
  amber: '#e0a03a', // нагрів
  ember: '#e2543a', // жар
} as const

/** Колір датчика за рівнем навантаження (патина → латунь → жар). */
export function usageColor(percent: number): string {
  if (percent < 55) return OXIDE.patina
  if (percent < 80) return OXIDE.amber
  return OXIDE.ember
}

export function tempColor(celsius: number): string {
  if (celsius < 60) return OXIDE.patina
  if (celsius < 80) return OXIDE.amber
  return OXIDE.ember
}
