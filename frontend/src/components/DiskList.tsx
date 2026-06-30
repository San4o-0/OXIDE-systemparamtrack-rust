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
        return (
          <div key={`${disk.name}-${disk.mount_point}-${i}`} className="disk">
            <div className="disk__head">
              <span>
                <span className="disk__mount">{disk.mount_point || disk.name || '—'}</span>
                {disk.mount_point && disk.name && (
                  <span className="disk__name">{disk.name}</span>
                )}
              </span>
              <span className="disk__usage">
                <b>{formatBytes(disk.used_bytes)}</b> / {formatBytes(disk.total_bytes)}
                {'  ·  '}
                {disk.usage_percent.toFixed(0)}%
              </span>
            </div>
            <div className="meter">
              <div
                className="meter__fill"
                style={{ width: `${Math.min(disk.usage_percent, 100)}%`, background: accent }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
