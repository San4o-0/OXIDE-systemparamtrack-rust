import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MetricsPoint } from '../api/useMetricsStream'
import { formatRate, OXIDE } from '../utils'
import type { ChartTheme } from '../theme'
import { useI18n } from '../i18n'

export function NetworkChart({ data, t }: { data: MetricsPoint[]; t: ChartTheme }) {
  const { t: tr } = useI18n()
  const points = data.map((p) => ({
    time: p.time,
    rx: p.network.rx_bytes_per_sec,
    tx: p.network.tx_bytes_per_sec,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="rxFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={OXIDE.patina} stopOpacity={0.28} />
            <stop offset="100%" stopColor={OXIDE.patina} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={t.grid} strokeWidth={0.6} vertical />
        <XAxis
          dataKey="time"
          stroke={t.axis}
          tick={{ fontSize: 10, fill: t.axis }}
          tickLine={false}
          axisLine={{ stroke: t.grid }}
          minTickGap={32}
        />
        <YAxis
          stroke={t.axis}
          tick={{ fontSize: 10, fill: t.axis }}
          tickLine={false}
          axisLine={false}
          width={62}
          tickFormatter={(v: number) => formatRate(v)}
        />
        <Tooltip
          cursor={{ stroke: OXIDE.patina, strokeWidth: 1, strokeDasharray: '3 3' }}
          contentStyle={{
            background: t.panel,
            border: `1px solid ${t.grid}`,
            borderRadius: 4,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
          }}
          labelStyle={{
            color: t.ink,
            fontSize: 10,
            fontFamily: 'Chakra Petch, sans-serif',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
          itemStyle={{ color: t.ink }}
          formatter={(v: number) => formatRate(v)}
        />
        <ReferenceLine y={0} stroke={t.grid} strokeWidth={1} />
        <Area
          type="monotone"
          dataKey="rx"
          name={`↓ ${tr('net.rx')}`}
          stroke={OXIDE.patina}
          strokeWidth={1.8}
          fill="url(#rxFill)"
          dot={false}
          activeDot={{ r: 3, fill: OXIDE.patina, stroke: t.panel, strokeWidth: 2 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="tx"
          name={`↑ ${tr('net.tx')}`}
          stroke={OXIDE.amber}
          strokeWidth={1.6}
          dot={false}
          activeDot={{ r: 3, fill: OXIDE.amber, stroke: t.panel, strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
