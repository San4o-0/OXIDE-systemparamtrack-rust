import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MetricsPoint } from '../api/useMetricsStream'
import { formatRate, OXIDE } from '../utils'
import type { ChartTheme } from '../theme'

export function NetworkChart({ data, t }: { data: MetricsPoint[]; t: ChartTheme }) {
  const points = data.map((p) => ({
    time: p.time,
    rx: p.network.rx_bytes_per_sec,
    tx: p.network.tx_bytes_per_sec,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
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
          labelStyle={{ color: t.axis, fontSize: 11 }}
          itemStyle={{ color: t.ink }}
          formatter={(v: number) => formatRate(v)}
        />
        <Line
          type="monotone"
          dataKey="rx"
          name="↓ приймання"
          stroke={OXIDE.patina}
          strokeWidth={1.8}
          dot={false}
          activeDot={{ r: 3, fill: OXIDE.patina, stroke: t.panel, strokeWidth: 2 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="tx"
          name="↑ передавання"
          stroke={OXIDE.amber}
          strokeWidth={1.8}
          dot={false}
          activeDot={{ r: 3, fill: OXIDE.amber, stroke: t.panel, strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
