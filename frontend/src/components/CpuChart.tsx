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
import { usageColor } from '../utils'
import type { ChartTheme } from '../theme'

interface Props {
  data: MetricsPoint[]
  t: ChartTheme
  height?: number
  hero?: boolean
}

export function CpuChart({ data, t, height = 240, hero = false }: Props) {
  const points = data.map((p) => ({
    time: p.time,
    cpu: Number(p.cpu.global_usage.toFixed(1)),
  }))

  // лінія сигналу окислюється від поточного нагріву
  const current = points.length ? points[points.length - 1].cpu : 0
  const stroke = usageColor(current)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={points}
        margin={{ top: hero ? 56 : 8, right: 12, bottom: 0, left: hero ? 4 : -18 }}
      >
        <CartesianGrid stroke={t.grid} strokeWidth={hero ? 1 : 0.6} vertical />
        <XAxis
          dataKey="time"
          stroke={t.axis}
          tick={{ fontSize: 10, fill: t.axis }}
          tickLine={false}
          axisLine={{ stroke: t.grid }}
          minTickGap={hero ? 60 : 32}
          hide={hero}
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          stroke={t.axis}
          tick={{ fontSize: 10, fill: t.axis }}
          tickLine={false}
          axisLine={false}
          unit="%"
          width={hero ? 38 : 34}
          orientation={hero ? 'right' : 'left'}
        />
        <Tooltip
          cursor={{ stroke: stroke, strokeWidth: 1, strokeDasharray: '3 3' }}
          contentStyle={{
            background: t.panel,
            border: `1px solid ${t.grid}`,
            borderRadius: 4,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
          }}
          labelStyle={{ color: t.axis, fontSize: 11 }}
          itemStyle={{ color: t.ink }}
        />
        <Line
          type="monotone"
          dataKey="cpu"
          name="CPU"
          unit="%"
          stroke={stroke}
          strokeWidth={hero ? 2.4 : 1.8}
          dot={false}
          activeDot={{ r: 3, fill: stroke, stroke: t.panel, strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
