export interface MetricsSnapshot {
  timestamp_ms: number
  cpu: CpuMetrics
  memory: MemoryMetrics
  disks: DiskMetrics[]
  network: NetworkMetrics
}

export interface NetworkMetrics {
  rx_bytes_per_sec: number
  tx_bytes_per_sec: number
  rx_total_bytes: number
  tx_total_bytes: number
}

export interface CpuMetrics {
  global_usage: number
  per_core: number[]
  temp_c: number | null
}

export interface MemoryMetrics {
  total_bytes: number
  used_bytes: number
  usage_percent: number
  swap_total_bytes: number
  swap_used_bytes: number
}

export interface DiskMetrics {
  name: string
  mount_point: string
  total_bytes: number
  available_bytes: number
  used_bytes: number
  usage_percent: number
}
