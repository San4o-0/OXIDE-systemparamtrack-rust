import { useEffect, useState } from 'react'
import { useMetricsStream } from './api/useMetricsStream'
import { useStressTest } from './api/useStressTest'
import { MetricCard } from './components/MetricCard'
import { CpuChart } from './components/CpuChart'
import { MemoryChart } from './components/MemoryChart'
import { DiskList } from './components/DiskList'
import { CoreMatrix } from './components/CoreMatrix'
import { NetworkChart } from './components/NetworkChart'
import { formatBytes, formatRate, OXIDE, tempColor, usageColor } from './utils'
import { CHART_THEME, readTheme, THEME_KEY, type ThemeName } from './theme'
import { useI18n } from './i18n'

export default function App() {
  const { latest, history, connected } = useMetricsStream()
  const { t, lang, setLang } = useI18n()
  const cpuLoad = useStressTest('cpu')
  const ramLoad = useStressTest('ram')
  const [theme, setTheme] = useState<ThemeName>(readTheme)
  const [alarm, setAlarm] = useState(false)

  useEffect(() => {
    if (!latest) {
      setAlarm(false)
      return
    }
    const u = latest.cpu.global_usage
    setAlarm((prev) => {
      if (prev) return u >= 75
      const tail = history.slice(-4)
      return tail.length >= 4 && tail.every((p) => p.cpu.global_usage >= 85)
    })
  }, [latest, history])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      void 0
    }
  }, [theme])

  const chart = CHART_THEME[theme]

  const cores = latest?.cpu.per_core.length ?? 0
  const peak = history.reduce((m, p) => Math.max(m, p.cpu.global_usage), 0)
  const swapPercent =
    latest && latest.memory.swap_total_bytes > 0
      ? (latest.memory.swap_used_bytes / latest.memory.swap_total_bytes) * 100
      : 0
  const temp = latest?.cpu.temp_c ?? null

  const loadButton = (
    load: ReturnType<typeof useStressTest>,
    cls: string,
    label: string,
  ) => (
    <button
      type="button"
      className={`stress ${cls} ${load.running ? 'is-hot' : ''}`}
      onClick={load.running ? load.stop : load.start}
      aria-label={label}
    >
      <span className="stress__led" aria-hidden="true" />
      {load.running ? t('load.stop', { n: load.secondsLeft }) : label}
    </button>
  )

  return (
    <div className={`app ${alarm ? 'is-alarm' : ''}`}>
      {alarm && <div className="alarm-strip" aria-hidden="true" />}
      <header className="faceplate">
        <div className="mark">
          <span className="mark__name">OXIDE</span>
          <span className="mark__bar" aria-hidden="true" />
          <span className="mark__kind">{t('mark.kind')}</span>
        </div>
        <div className="face-meta">
          <span className="face-meta__host">
            host <b>localhost:3000</b>
            {cores > 0 && <> · {t('face.cores', { n: cores })}</>}
          </span>
          {alarm && (
            <span className="overheat" role="status">
              <span className="overheat__led" aria-hidden="true" />
              {t('overheat')}
            </span>
          )}
          <button
            type="button"
            className="lang-toggle"
            onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}
            aria-label={t('lang.aria')}
          >
            {lang === 'uk' ? 'EN' : 'UK'}
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'oxide' ? 'paper' : 'oxide')}
            aria-label={t('theme.aria')}
          >
            {theme === 'oxide' ? t('theme.paper') : t('theme.steel')}
          </button>
          <span className={`signal ${connected ? 'is-on' : 'is-off'}`} role="status">
            <span className="signal__led" aria-hidden="true" />
            {connected ? t('signal.on') : t('signal.off')}
          </span>
        </div>
      </header>

      {!latest ? (
        <div className="standby">
          <p className="standby__title">{t('standby.title')}</p>
          <p className="standby__body">{t('standby.body')}</p>
          <code className="standby__cmd">cd backend &amp;&amp; cargo run</code>
          {loadButton(cpuLoad, 'standby__control', t('load.cpu'))}
        </div>
      ) : (
        <main className="power">
          <section className="hero" aria-label={t('hero.head')}>
            <span className="hero__head">{t('hero.head')}</span>
            {loadButton(cpuLoad, 'hero__control', t('load.cpu'))}
            <div className="hero__readout">
              <span
                className="hero__value"
                style={{ color: usageColor(latest.cpu.global_usage) }}
              >
                {latest.cpu.global_usage.toFixed(1)}
              </span>
              <span className="hero__unit">%</span>
              <div className="hero__chips">
                <span className="chip">
                  <b>{cores}</b>
                  <span className="chip__k">{t('chip.cores')}</span>
                </span>
                {temp != null && (
                  <span className="chip">
                    <b style={{ color: tempColor(temp) }}>{temp.toFixed(0)}°C</b>
                    <span className="chip__k">{t('chip.temp')}</span>
                  </span>
                )}
                <span className="chip">
                  <b>{peak.toFixed(0)}%</b>
                  <span className="chip__k">{t('chip.peak')}</span>
                </span>
              </div>
            </div>
            <div className="hero__plot">
              <CpuChart data={history} t={chart} height={320} hero />
            </div>
            <span className="hero__sweep" aria-hidden="true" />
          </section>

          <section className="vitals" aria-label={t('hero.head')}>
            <MetricCard
              label="CPU"
              index="cpu"
              value={latest.cpu.global_usage.toFixed(1)}
              unit="%"
              percent={latest.cpu.global_usage}
              subtitle={
                temp != null
                  ? t('vital.cpu.subTemp', { n: cores, t: temp.toFixed(0) })
                  : t('vital.cpu.sub', { n: cores })
              }
            />
            <MetricCard
              label="RAM"
              index="mem"
              value={latest.memory.usage_percent.toFixed(1)}
              unit="%"
              percent={latest.memory.usage_percent}
              subtitle={`${formatBytes(latest.memory.used_bytes)} / ${formatBytes(
                latest.memory.total_bytes,
              )}`}
            />
            <MetricCard
              label="Swap"
              index="swp"
              value={formatBytes(latest.memory.swap_used_bytes)}
              percent={swapPercent}
              subtitle={t('vital.swap.sub', { x: formatBytes(latest.memory.swap_total_bytes) })}
            />
            <MetricCard
              label={t('vital.disks')}
              index="vol"
              value={`${latest.disks.length}`}
              subtitle={t('vital.disks.sub')}
            />
          </section>

          <section className="scopes" aria-label={t('panel.cpu')}>
            <div className="panel">
              <div className="panel__head">
                <h2 className="panel__title">{t('panel.cpu')}</h2>
                <span className="panel__note">{t('note.samples', { n: history.length })}</span>
              </div>
              <CpuChart data={history} t={chart} />
            </div>
            <div className="panel">
              <div className="panel__head">
                <h2 className="panel__title">{t('panel.ram')}</h2>
                {loadButton(ramLoad, 'panel__control', t('load.ram'))}
              </div>
              <MemoryChart data={history} t={chart} />
            </div>
          </section>

          <section className="panel" aria-label={t('panel.net')}>
            <div className="panel__head">
              <h2 className="panel__title">{t('panel.net')}</h2>
              <div className="net-readout">
                <span className="net-stat" style={{ color: OXIDE.patina }}>
                  ↓ {formatRate(latest.network.rx_bytes_per_sec)}
                </span>
                <span className="net-stat" style={{ color: OXIDE.amber }}>
                  ↑ {formatRate(latest.network.tx_bytes_per_sec)}
                </span>
              </div>
            </div>
            <NetworkChart data={history} t={chart} />
          </section>

          <section className="panel" aria-label={t('panel.cores')}>
            <div className="panel__head">
              <h2 className="panel__title">{t('panel.cores')}</h2>
              <span className="panel__note">
                {t('note.matrix', { n: history.length, k: cores })}
              </span>
            </div>
            <CoreMatrix history={history} />
          </section>

          <section className="panel" aria-label={t('panel.volumes')}>
            <div className="panel__head">
              <h2 className="panel__title">{t('panel.volumes')}</h2>
              <span className="panel__note">{t('note.volumes')}</span>
            </div>
            <DiskList disks={latest.disks} />
          </section>
        </main>
      )}

      <footer className="colophon">
        <span>{t('colophon')}</span>
        <span className="colophon__stack">
          <span>Rust</span> axum <span>sysinfo</span> · SSE · <span>React</span> recharts
        </span>
      </footer>
    </div>
  )
}
