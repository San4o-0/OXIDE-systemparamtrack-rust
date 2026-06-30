import type { DiskMetrics } from '../types'
import { formatBytes, usageColor } from '../utils'
import { useI18n } from '../i18n'

export function DiskList({ disks }: { disks: DiskMetrics[] }) {
  const { t } = useI18n()
  if (disks.length === 0) {
    return <div className="gauge__sub">{t('disks.empty')}</div>
  }

  return (
    <div className="disks">
      {disks.map((disk, i) => {
        const accent = usageColor(disk.usage_percent)
        const dev = disk.name || disk.mount_point || '—'
        const path = disk.name && disk.mount_point ? disk.mount_point : ''
        return (
          <div key={`${disk.name}-${disk.mount_point}-${i}`} className="disk">
            <span className="disk__id">
              <svg
                className="disk__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="1.5" />
                <line x1="3" y1="11" x2="21" y2="11" />
                <circle cx="7" cy="8" r="0.6" fill="currentColor" stroke="none" />
                <circle cx="7" cy="15" r="0.6" fill="currentColor" stroke="none" />
              </svg>
              <span className="disk__labels">
                <span className="disk__dev">{dev}</span>
                {path && <span className="disk__path">{path}</span>}
              </span>
            </span>
            <div className="disk__track">
              <div className="meter">
                <div
                  className="meter__fill"
                  style={{ width: `${Math.min(disk.usage_percent, 100)}%`, background: accent }}
                />
              </div>
            </div>
            <span className="disk__readout">
              <b style={{ color: accent }}>{disk.usage_percent.toFixed(0)}%</b>
              <span>
                {formatBytes(disk.used_bytes)} / {formatBytes(disk.total_bytes)}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
