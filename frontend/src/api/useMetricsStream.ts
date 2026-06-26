import { useEffect, useState } from 'react'
import type { MetricsSnapshot } from '../types'

const STREAM_URL = 'http://localhost:3000/api/stream'
const MAX_HISTORY = 30

export interface MetricsPoint extends MetricsSnapshot {
  time: string
}

export interface StreamState {
  latest: MetricsSnapshot | null
  history: MetricsPoint[]
  connected: boolean
}

export function useMetricsStream(): StreamState {
  const [latest, setLatest] = useState<MetricsSnapshot | null>(null)
  const [history, setHistory] = useState<MetricsPoint[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const source = new EventSource(STREAM_URL)

    source.onopen = () => setConnected(true)
    source.onerror = () => setConnected(false)

    source.onmessage = (event) => {
      const snapshot: MetricsSnapshot = JSON.parse(event.data)
      setLatest(snapshot)

      const time = new Date(snapshot.timestamp_ms).toLocaleTimeString()
      setHistory((prev) => [...prev, { ...snapshot, time }].slice(-MAX_HISTORY))
    }

    return () => source.close()
  }, [])

  return { latest, history, connected }
}
