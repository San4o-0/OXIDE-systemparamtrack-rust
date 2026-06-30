import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MetricsPoint } from '../api/useMetricsStream'
import { OXIDE, usageColor } from '../utils'
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

  const current = points.length ? points[points.length - 1].cpu : 0
  const stroke = usageColor(current)
  const fillId = hero ? 'cpuFillHero' : 'cpuFill'

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={points}
        margin={{ top: hero ? 56 : 8, right: 12, bottom: 0, left: hero ? 4 : -18 }}
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={hero ? 0.34 : 0.22} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
          cursor={{ stroke, strokeWidth: 1, strokeDasharray: '3 3' }}
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
        <ReferenceLine
          y={85}
          stroke={OXIDE.ember}
          strokeDasharray="2 4"
          strokeWidth={1}
          ifOverflow="extendDomain"
          label={
            hero
              ? {
                  value: 'ALARM 85',
                  position: 'insideTopRight',
                  fill: OXIDE.ember,
                  fontSize: 9,
                  fontFamily: 'Chakra Petch',
                  letterSpacing: '0.18em',
                  dy: -4,
                }
              : undefined
          }
        />
        <Area
          type="monotone"
          dataKey="cpu"
          name="CPU"
          unit="%"
          stroke={stroke}
          strokeWidth={hero ? 2.4 : 1.8}
          fill={`url(#${fillId})`}
          dot={false}
          activeDot={{ r: 3, fill: stroke, stroke: t.panel, strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
