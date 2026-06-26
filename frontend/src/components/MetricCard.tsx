import type { CSSProperties, ReactNode } from 'react'
import { usageColor } from '../utils'

interface Props {
  label: string
  index: string
  value: string
  unit?: string
  subtitle?: ReactNode
  percent?: number
}

export function MetricCard({ label, index, value, unit, subtitle, percent }: Props) {
  const accent = percent !== undefined ? usageColor(percent) : undefined
  const fill = percent !== undefined ? `${Math.min(percent, 100)}%` : '0%'

  return (
    <div
      className="gauge"
      style={accent ? ({ ['--accent' as string]: accent } as CSSProperties) : undefined}
    >
      <span
        className="gauge__edge"
        style={{ ['--fill' as string]: fill } as CSSProperties}
      />
      <div className="gauge__top">
        <span className="gauge__label">{label}</span>
        <span className="gauge__idx">{index}</span>
      </div>
      <div className="gauge__value">
        {value}
        {unit && <span className="u">{unit}</span>}
      </div>
      {percent !== undefined && (
        <div className="meter">
          <div
            className="meter__fill"
            style={{ width: fill, background: accent }}
          />
        </div>
      )}
      {subtitle && <div className="gauge__sub">{subtitle}</div>}
    </div>
  )
}
