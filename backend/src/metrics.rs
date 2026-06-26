use std::time::{SystemTime, UNIX_EPOCH};

use sysinfo::{Components, Disks, Networks, System};

use crate::models::{
    CpuMetrics, DiskMetrics, MemoryMetrics, MetricsSnapshot, NetworkMetrics,
};

pub struct Collector {
    sys: System,
    disks: Disks,
    components: Components,
    networks: Networks,
}

impl Collector {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_cpu_all();
        sys.refresh_memory();
        let disks = Disks::new_with_refreshed_list();
        let components = Components::new_with_refreshed_list();
        let networks = Networks::new_with_refreshed_list();
        Self {
            sys,
            disks,
            components,
            networks,
        }
    }

    pub fn collect(&mut self) -> MetricsSnapshot {
        self.sys.refresh_cpu_all();
        self.sys.refresh_memory();
        self.disks.refresh();
        self.components.refresh();
        self.networks.refresh();

        let cpu = CpuMetrics {
            global_usage: self.sys.global_cpu_usage(),
            per_core: self.sys.cpus().iter().map(|c| c.cpu_usage()).collect(),
            temp_c: cpu_temp(&self.components),
        };

        let total = self.sys.total_memory();
        let used = self.sys.used_memory();
        let memory = MemoryMetrics {
            total_bytes: total,
            used_bytes: used,
            usage_percent: percent(used, total),
            swap_total_bytes: self.sys.total_swap(),
            swap_used_bytes: self.sys.used_swap(),
        };

        let disks = self
            .disks
            .iter()
            .map(|d| {
                let total = d.total_space();
                let available = d.available_space();
                let used = total.saturating_sub(available);
                DiskMetrics {
                    name: d.name().to_string_lossy().into_owned(),
                    mount_point: d.mount_point().to_string_lossy().into_owned(),
                    total_bytes: total,
                    available_bytes: available,
                    used_bytes: used,
                    usage_percent: percent(used, total),
                }
            })
            .collect();

        let network = collect_network(&self.networks);

        MetricsSnapshot {
            timestamp_ms: now_ms(),
            cpu,
            memory,
            disks,
            network,
        }
    }
}

fn collect_network(networks: &Networks) -> NetworkMetrics {
    let mut rx = 0u64;
    let mut tx = 0u64;
    let mut rx_total = 0u64;
    let mut tx_total = 0u64;

    for (name, data) in networks.iter() {
        if name == "lo" || name.starts_with("lo") {
            continue;
        }
        rx += data.received();
        tx += data.transmitted();
        rx_total += data.total_received();
        tx_total += data.total_transmitted();
    }

    NetworkMetrics {
        rx_bytes_per_sec: rx,
        tx_bytes_per_sec: tx,
        rx_total_bytes: rx_total,
        tx_total_bytes: tx_total,
    }
}

impl Default for Collector {
    fn default() -> Self {
        Self::new()
    }
}

fn cpu_temp(components: &Components) -> Option<f32> {
    let mut package = None;
    let mut cores: Vec<f32> = Vec::new();
    let mut fallback = None;

    for c in components.iter() {
        let t = c.temperature();
        if !t.is_finite() || t <= 0.0 {
            continue;
        }
        let label = c.label().to_lowercase();
        if label.contains("package") || label.contains("tctl") || label.contains("tdie") {
            package = Some(t);
        } else if label.contains("core") {
            cores.push(t);
        } else if label.contains("cpu") || label.contains("acpitz") {
            fallback = Some(fallback.map_or(t, |f: f32| f.max(t)));
        }
    }

    package
        .or_else(|| {
            if cores.is_empty() {
                None
            } else {
                Some(cores.into_iter().fold(f32::NEG_INFINITY, f32::max))
            }
        })
        .or(fallback)
}

fn percent(part: u64, whole: u64) -> f32 {
    if whole == 0 {
        0.0
    } else {
        (part as f64 / whole as f64 * 100.0) as f32
    }
}

fn now_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0)
}
