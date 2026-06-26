import { useEffect, useState } from 'react'
import { useMetricsStream } from './api/useMetricsStream'
import { MetricCard } from './components/MetricCard'
import { CpuChart } from './components/CpuChart'
import { MemoryChart } from './components/MemoryChart'
import { DiskList } from './components/DiskList'
import { CoreMatrix } from './components/CoreMatrix'
import { NetworkChart } from './components/NetworkChart'
import { formatBytes, formatRate, OXIDE, tempColor, usageColor } from './utils'
import { CHART_THEME, readTheme, THEME_KEY, type ThemeName } from './theme'

export default function App() {
  const { latest, history, connected } = useMetricsStream()
  const [theme, setTheme] = useState<ThemeName>(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      void 0
    }
  }, [theme])

  const t = CHART_THEME[theme]

  const cores = latest?.cpu.per_core.length ?? 0
  const peak = history.reduce((m, p) => Math.max(m, p.cpu.global_usage), 0)
  const swapPercent =
    latest && latest.memory.swap_total_bytes > 0
      ? (latest.memory.swap_used_bytes / latest.memory.swap_total_bytes) * 100
      : 0
  const temp = latest?.cpu.temp_c ?? null

  return (
    <div className="app">
      <header className="faceplate">
        <div className="mark">
          <span className="mark__name">OXIDE</span>
          <span className="mark__bar" aria-hidden="true" />
          <span className="mark__kind">телеметрія</span>
        </div>
        <div className="face-meta">
          <span className="face-meta__host">
            host <b>localhost:3000</b>
            {cores > 0 && <> · <b>{cores}</b> ядер</>}
          </span>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'oxide' ? 'paper' : 'oxide')}
            aria-label="Перемкнути тему"
          >
            {theme === 'oxide' ? 'папір' : 'сталь'}
          </button>
          <span className={`signal ${connected ? 'is-on' : 'is-off'}`} role="status">
            <span className="signal__led" aria-hidden="true" />
            {connected ? 'сигнал' : 'немає зв’язку'}
          </span>
        </div>
      </header>

      {!latest ? (
        <div className="standby">
          <p className="standby__title">очікування сигналу</p>
          <p className="standby__body">
            Прилад під’єднано до <code>localhost:3000/api/stream</code>, але потоку ще
            немає. Запусти бекенд: <code>cd backend &amp;&amp; cargo run</code> — і трек
            оживе щосекунди.
          </p>
        </div>
      ) : (
        <main className="power">
          {/* HERO — глобальне навантаження як жива осцилограма */}
          <section className="hero" aria-label="Глобальне завантаження CPU">
            <span className="hero__head">global load</span>
            <div className="hero__sub">
              {temp != null && (
                <>
                  <div className="tag">температура</div>
                  <b style={{ color: tempColor(temp) }}>{temp.toFixed(0)}°C</b>
                </>
              )}
              <div className="tag" style={{ marginTop: 8 }}>пік за {history.length}с</div>
              <b>{peak.toFixed(1)}%</b>
              <div className="tag" style={{ marginTop: 8 }}>такт</div>
              <b>1.00 с</b>
            </div>
            <div className="hero__readout">
              <span
                className="hero__value"
                style={{ color: usageColor(latest.cpu.global_usage) }}
              >
                {latest.cpu.global_usage.toFixed(1)}
              </span>
              <span className="hero__unit">%</span>
            </div>
            <div className="hero__plot">
              <CpuChart data={history} t={t} height={320} hero />
            </div>
            <span className="hero__sweep" aria-hidden="true" />
          </section>

          {/* VITALS — показники */}
          <section className="vitals" aria-label="Ключові показники">
            <MetricCard
              label="CPU"
              index="cpu"
              value={latest.cpu.global_usage.toFixed(1)}
              unit="%"
              percent={latest.cpu.global_usage}
              subtitle={temp != null ? `${cores} ядер · ${temp.toFixed(0)}°C` : `${cores} логічних ядер`}
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
              subtitle={`усього ${formatBytes(latest.memory.swap_total_bytes)}`}
            />
            <MetricCard
              label="Томи"
              index="vol"
              value={`${latest.disks.length}`}
              subtitle="змонтованих"
            />
          </section>

          {/* SCOPES — треки */}
          <section className="scopes" aria-label="Графіки треку">
            <div className="panel">
              <div className="panel__head">
                <h2 className="panel__title">CPU · трек</h2>
                <span className="panel__note">{history.length} відліків · %</span>
              </div>
              <CpuChart data={history} t={t} />
            </div>
            <div className="panel">
              <div className="panel__head">
                <h2 className="panel__title">RAM · трек</h2>
                <span className="panel__note">{history.length} відліків · %</span>
              </div>
              <MemoryChart data={history} t={t} />
            </div>
          </section>

          <section className="panel" aria-label="Мережевий трафік">
            <div className="panel__head">
              <h2 className="panel__title">Мережа</h2>
              <div className="net-readout">
                <span className="net-stat" style={{ color: OXIDE.patina }}>
                  ↓ {formatRate(latest.network.rx_bytes_per_sec)}
                </span>
                <span className="net-stat" style={{ color: OXIDE.amber }}>
                  ↑ {formatRate(latest.network.tx_bytes_per_sec)}
                </span>
              </div>
            </div>
            <NetworkChart data={history} t={t} />
          </section>

          <section className="panel" aria-label="Теплова матриця ядер">
            <div className="panel__head">
              <h2 className="panel__title">Масив ядер</h2>
              <span className="panel__note">
                ядро × час · {history.length}с · {cores} логічних
              </span>
            </div>
            <CoreMatrix history={history} />
          </section>

          {/* VOLUMES — томи */}
          <section className="panel" aria-label="Змонтовані томи">
            <div className="panel__head">
              <h2 className="panel__title">Томи</h2>
              <span className="panel__note">зайнято / усього</span>
            </div>
            <DiskList disks={latest.disks} />
          </section>
        </main>
      )}

      <footer className="colophon">
        <span>OXIDE · приладова телеметрія</span>
        <span className="colophon__stack">
          <span>Rust</span> axum <span>sysinfo</span> · SSE · <span>React</span> recharts
        </span>
      </footer>
    </div>
  )
}
