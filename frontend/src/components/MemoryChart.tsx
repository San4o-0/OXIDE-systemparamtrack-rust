import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MetricsPoint } from '../api/useMetricsStream'
import { usageColor } from '../utils'
import type { ChartTheme } from '../theme'

export function MemoryChart({ data, t }: { data: MetricsPoint[]; t: ChartTheme }) {
  const points = data.map((p) => ({
    time: p.time,
    mem: Number(p.memory.usage_percent.toFixed(1)),
  }))

  const current = points.length ? points[points.length - 1].mem : 0
  const tint = usageColor(current)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id="memFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tint} stopOpacity={0.42} />
            <stop offset="100%" stopColor={tint} stopOpacity={0.02} />
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
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          stroke={t.axis}
          tick={{ fontSize: 10, fill: t.axis }}
          tickLine={false}
          axisLine={false}
          unit="%"
          width={34}
        />
        <Tooltip
          cursor={{ stroke: tint, strokeWidth: 1, strokeDasharray: '3 3' }}
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
        />
        <Area
          type="monotone"
          dataKey="mem"
          name="RAM"
          unit="%"
          stroke={tint}
          strokeWidth={1.8}
          fill="url(#memFill)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
