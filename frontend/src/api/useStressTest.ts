import { useCallback, useEffect, useRef, useState } from 'react'

const WORKER_URL = URL.createObjectURL(
  new Blob(['let x=0;for(;;){x+=Math.sqrt(Math.random()*1e9)}'], {
    type: 'text/javascript',
  }),
)

const CHUNK = 64 * 1024 * 1024

function ramTarget(): number {
  const gib = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4
  return Math.min(2, gib * 0.12) * 1024 * 1024 * 1024
}

export type LoadKind = 'cpu' | 'ram'

export function useStressTest(kind: LoadKind, durationMs = 15000) {
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const workers = useRef<Worker[]>([])
  const blocks = useRef<Uint8Array[]>([])
  const stopTimer = useRef<number>()
  const ticker = useRef<number>()

  const stop = useCallback(() => {
    workers.current.forEach((w) => w.terminate())
    workers.current = []
    blocks.current = []
    window.clearTimeout(stopTimer.current)
    window.clearInterval(ticker.current)
    setRunning(false)
    setSecondsLeft(0)
  }, [])

  const start = useCallback(() => {
    if (workers.current.length || blocks.current.length) return

    if (kind === 'cpu') {
      const cores = navigator.hardwareConcurrency || 4
      workers.current = Array.from({ length: cores }, () => new Worker(WORKER_URL))
    } else {
      try {
        const target = ramTarget()
        for (let allocated = 0; allocated < target; allocated += CHUNK) {
          const block = new Uint8Array(CHUNK)
          for (let j = 0; j < block.length; j += 4096) block[j] = 1
          blocks.current.push(block)
        }
      } catch {
        void 0
      }
    }

    setRunning(true)
    setSecondsLeft(Math.round(durationMs / 1000))
    stopTimer.current = window.setTimeout(stop, durationMs)
    ticker.current = window.setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    )
  }, [kind, durationMs, stop])

  useEffect(() => stop, [stop])

  return { running, secondsLeft, start, stop }
}
