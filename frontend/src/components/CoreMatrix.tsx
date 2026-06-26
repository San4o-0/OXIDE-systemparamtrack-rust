import type { MetricsPoint } from '../api/useMetricsStream'
import { usageColor } from '../utils'

export function CoreMatrix({ history }: { history: MetricsPoint[] }) {
  const last = history[history.length - 1]
  const cores = last?.cpu.per_core.length ?? 0
  if (!cores) {
    return <div className="gauge__sub">Очікування відліків…</div>
  }

  return (
    <div className="matrix">
      {Array.from({ length: cores }, (_, core) => {
        const current = last.cpu.per_core[core] ?? 0
        return (
          <div className="matrix__row" key={core}>
            <span className="matrix__idx">#{core}</span>
            <div className="matrix__strip">
              {history.map((p, t) => {
                const u = p.cpu.per_core[core] ?? 0
                return (
                  <span
                    key={t}
                    className="matrix__cell"
                    style={{
                      background: usageColor(u),
                      opacity: 0.2 + (Math.min(u, 100) / 100) * 0.8,
                    }}
                    title={`${u.toFixed(0)}%`}
                  />
                )
              })}
            </div>
            <span className="matrix__val" style={{ color: usageColor(current) }}>
              {current.toFixed(0)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
