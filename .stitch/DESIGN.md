---
name: OXIDE
colors:
  surface: '#14171a'
  surface-dim: '#181b1f'
  surface-bright: '#22272c'
  surface-container-lowest: '#14171a'
  surface-container-low: '#181b1f'
  surface-container: '#1c2024'
  surface-container-high: '#22272c'
  surface-container-highest: '#2e343a'
  on-surface: '#e8e6e1'
  on-surface-variant: '#8b949e'
  inverse-surface: '#e8e6e1'
  inverse-on-surface: '#14171a'
  outline: '#2e343a'
  outline-variant: '#23282d'
  surface-tint: '#3fb6a8'
  primary: '#3fb6a8'
  on-primary: '#14171a'
  primary-container: '#1c2024'
  on-primary-container: '#3fb6a8'
  inverse-primary: '#3fb6a8'
  secondary: '#e0a03a'
  on-secondary: '#14171a'
  secondary-container: '#22272c'
  on-secondary-container: '#e0a03a'
  tertiary: '#8b949e'
  on-tertiary: '#14171a'
  tertiary-container: '#1c2024'
  on-tertiary-container: '#8b949e'
  error: '#e2543a'
  on-error: '#e8e6e1'
  error-container: '#22272c'
  on-error-container: '#e2543a'
  warning: '#e0a03a'
  success: '#3fb6a8'
  background: '#14171a'
  on-background: '#e8e6e1'
  surface-variant: '#22272c'
typography:
  display-xl:
    fontFamily: JetBrains Mono
    fontSize: 124px
    fontWeight: '800'
    lineHeight: 97px
    letterSpacing: -0.045em
  stat-lg:
    fontFamily: JetBrains Mono
    fontSize: 33px
    fontWeight: '800'
    lineHeight: 31px
    letterSpacing: -0.02em
  label-caps:
    fontFamily: Chakra Petch
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.3em
  eyebrow:
    fontFamily: Chakra Petch
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.42em
  body-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 23px
    letterSpacing: '0'
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 2px
  DEFAULT: 4px
  md: 4px
  lg: 4px
  xl: 4px
  full: 999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 18px
  xl: 22px
  gutter: 18px
  margin-mobile: 16px
  margin-desktop: 22px
---

## Brand & Style

OXIDE is a system-telemetry instrument panel, not a web dashboard. The personality
is industrial, precise, and tactile — a piece of bench equipment milled from
gunmetal rather than a SaaS app. Every surface reads as a machined steel faceplate:
beveled top edge catching a thin highlight, a soft shadow seating it into the
chassis below. Data is the only ornament. There are no decorative illustrations,
no rounded "bubble" cards, no gradients-for-the-sake-of-gradients, and absolutely
no purple. If it looks like a generic admin template, it is wrong.

The governing metaphor is **oxidation**: as system load rises, values heat and
corrode along a fixed ramp — cool **patina** teal at rest, **amber** brass under
moderate load, **ember** red at overheat. Color is never decorative; a hue change
always encodes a state change. The interface stays near-monochrome gunmetal so
that the oxidation ramp is the single source of chromatic signal. A light "paper"
skin exists for documentation/print, but the canonical identity is the dark
faceplate.

## Colors

The chassis is built from a tight stack of **gunmetal steels** (`#14171a` →
`#22272c`), separated by hairline `#2e343a` rules. Text is warm off-white **bone**
(`#e8e6e1`) for primaries and cool **zinc** grays (`#8b949e`, `#5c646c`) for
labels and secondary data.

The entire accent system is a three-stop **oxidation ramp**, applied by value, not
by brand whim:

- **Patina** `#3fb6a8` — nominal / healthy state (load < 55%). The resting color
  of LEDs, gauges, sparkline fills, and the brand tick mark.
- **Amber** `#e0a03a` — elevated / caution (load 55–80%). Secondary chart traces
  (e.g. network TX), warming gauges.
- **Ember** `#e2543a` — critical / overheat (load ≥ 80%, or the 85% ALARM line).
  Drives the ALARM strip, overheat badge, and the hot state of the stress button.

Functional mapping: `primary` = patina (nominal/interactive), `secondary` = amber
(caution), `error` = ember (critical). These are the ONLY saturated colors in the
system — everything else is gunmetal or grayscale.

## Typography

Two typefaces, strictly role-divided:

- **Chakra Petch** (geometric, slightly squared sans) — all labels, eyebrows,
  panel titles, and badges. Always UPPERCASE with wide tracking (0.24em–0.42em).
  It reads as silkscreened legend printed onto the metal.
- **JetBrains Mono** — every number, readout, and machine string. Always
  `tabular-nums slashed-zero` so digits never reflow and zeros read as engineering
  zeros. The hero readout is a single enormous monospaced figure (clamp up to
  124px, weight 800, tight -0.045em tracking, line-height < 1) treated as a
  seven-segment instrument display, with a soft load-reactive glow in `currentColor`.

There is no serif, no humanist body face, and no font used for both labels and
numbers. The split itself is part of the identity.

## Component Stylings

### Panels / Gauges / Hero (the faceplate primitive)
Every container shares one recipe: 1px `#2e343a` border, 4px radius (nearly square —
never pill-soft), a top-to-bottom gunmetal gradient (`#1c2024` → `#181b1f`), and a
two-part elevation — `inset 0 1px 0 rgba(255,255,255,0.05)` bevel highlight on the
top edge plus a `0 6px 18px` seating shadow. Panel titles are prefixed with a 3px
patina tick mark. Gauges lift 1px on hover. No drop-shadowed floating cards, no
glassmorphism.

### Wells (recessed data slots)
Meters and the per-core heat matrix sit in *recessed* wells: darkest steel
(`#14171a`) background with an `inset 0 1px 2px rgba(0,0,0,0.5)` shadow, so the
live data looks milled into the panel. Meter fills animate from zero on load
(a needle settling) and transition color along the oxidation ramp.

### Buttons & Controls
Pill-shaped (999px) outline buttons — the one place radius goes full-round, to read
as physical toggles. Theme/lang toggles are quiet gunmetal outlines. The **stress
test** control is louder: bone text on `#22272c`, amber LED, amber glow on hover;
when active it flips to a solid ember fill with a pulsing animation ("is-hot").

### Status indicators
Small LED dots (7–8px circles) with a colored box-shadow halo, paired with an
uppercase Chakra Petch label inside a pill. Signal = patina when live, ember when
dropped. The ALARM state adds a fixed 3px ember strip pinned to the top of the
viewport, pulsing, plus an "OVERHEAT" badge.

### Charts (Recharts)
Flat, gridded oscilloscope traces. Hairline `#2e343a` grid, mono tick labels,
no chart chrome. CPU is an area chart with a gradient fill and a dashed ember
`ALARM 85` reference line. Network shows RX as a patina filled area and TX as an
amber line over a zero baseline. Tooltips are gunmetal panels with Chakra Petch
eyebrow labels.

## Layout Principles

- **Grid**: single centered column, `max-width: 1180px`, 22px edge padding,
  18px base gap between blocks. Vitals and scopes use `auto-fit minmax` grids
  (210px gauges, 340px scopes) that reflow without breakpoints.
- **Faceplate header**: sticky top bar — wordmark (OXIDE, 0.34em tracking, blinking
  patina bar) on the left, live host meta + signal LED + toggles on the right,
  hairline bottom rule.
- **Spacing**: 4px base unit; generous vertical rhythm but dense data packing
  inside panels (this is an instrument, information density is a feature).
- **Motion**: restrained and mechanical — a one-shot power-on cascade (rows fade up
  in sequence), needle/meter settling, LED pulses, oxidation color transitions
  (0.5–0.6s). One sweep across the hero on boot. All of it is disabled under
  `prefers-reduced-motion`. Avoid perpetual scanning/shimmer — it reads as AI slop.

## Design System Notes for Stitch Generation

### Language to Use
"Machined gunmetal faceplate", "recessed data well", "seven-segment readout",
"oxidation ramp", "hairline steel rule", "silkscreen legend label", "instrument
panel", "beveled top edge seated with a soft shadow".

### Color References
- Gunmetal chassis: `#14171a` / `#1c2024` / `#22272c`, hairlines `#2e343a`.
- Bone text `#e8e6e1`, zinc labels `#8b949e`.
- Oxidation ramp ONLY for state: patina `#3fb6a8` (ok) → amber `#e0a03a`
  (caution) → ember `#e2543a` (critical). Never introduce a fourth accent.

### Component Prompts
- "A machined gunmetal gauge card: 1px steel border, 4px radius, top-bevel
  highlight, an uppercase Chakra Petch label, a large JetBrains Mono value, and a
  thin recessed meter bar whose fill is patina teal."
- "A sticky instrument faceplate header with a spaced-out OXIDE wordmark, a
  blinking patina indicator bar, and a live signal LED pill on the right."
- "A per-core heat matrix: rows of recessed strips made of tiny cells colored
  along a teal→amber→red oxidation ramp by load."

### Incremental Iteration
Keep the canvas near-monochrome gunmetal; let the oxidation ramp carry all color.
Reject any revision that adds rounded bubble cards, soft pastel gradients, purple,
glassmorphism, or a humanist body font — those break the OXIDE identity. Preserve
the Chakra Petch (labels) / JetBrains Mono (numbers) split and the patina→amber→ember
state semantics in every screen.
