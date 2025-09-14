import type { Ref, ComputedRef } from 'vue'
import { ref, watch, computed, onMounted } from 'vue'

interface StatusData {
  players?: {
    count: number
  }
  latencyMs?: number | null
  health?: {
    ok: boolean
  }
}

interface HistoryPoint {
  t: number
  count: number
  latency: number | null
  ok: boolean
}

export function useStatusHistory(data: Ref<StatusData | undefined>, loading: Ref<boolean>) {
  const history = ref<HistoryPoint[]>([])
  const maxPoints = 30 // Keep last 30 data points
  let lastUpdate = 0
  const updateInterval = 1000 // 1 second for initial load, then 5 seconds

  const addDataPoint = () => {
    if (!data.value) return
    
    const now = Date.now()
    
    // Only add a new point if enough time has passed or it's the first point
    if (history.value.length > 0 && now - lastUpdate < updateInterval) return
    
    lastUpdate = now
    
    const point: HistoryPoint = {
      t: now,
      count: data.value.players?.count ?? 0,
      latency: data.value.latencyMs ?? null,
      ok: data.value.health?.ok ?? false
    }

    // Add new point and keep only the last maxPoints
    history.value = [...history.value.slice(-(maxPoints - 1)), point]
  }

  // Add initial point immediately when data is available
  onMounted(() => {
    if (data.value) {
      addDataPoint()
    }
  })

  // Watch for data changes and add points
  watch(() => data.value, (newVal, oldVal) => {
    if (newVal && !loading.value) {
      addDataPoint()
    }
  }, { deep: true })

  // Get players history in the format expected by PlayersHistoryCard
  const players: ComputedRef<Array<{ t: number; count: number; latency: number | null }>> = computed(() => {
    if (history.value.length === 0 && data.value) {
      // If no history but we have data, create a point
      return [{
        t: Date.now(),
        count: data.value.players?.count ?? 0,
        latency: data.value.latencyMs ?? null
      }]
    }
    return history.value.map(p => ({
      t: p.t,
      count: p.count,
      latency: p.latency
    }))
  })

  // Get latency history in the format expected by LatencyHistoryCard
  const latency: ComputedRef<Array<{ t: number; latency: number }>> = computed(() => {
    const points = history.value.length > 0 
      ? history.value 
      : (data.value ? [{
          t: Date.now(),
          count: data.value.players?.count ?? 0,
          latency: data.value.latencyMs ?? null,
          ok: data.value.health?.ok ?? false
        }] : [])
        
    return points
      .filter(p => p.latency !== null)
      .map(p => ({
        t: p.t,
        latency: p.latency as number
      }))
  })

  // Get uptime series in the format expected by UptimeChartCard
  const uptimeSeries: ComputedRef<Array<{ t: number; ok: boolean }>> = computed(() => {
    if (history.value.length === 0 && data.value) {
      // If no history but we have data, create a point
      return [{
        t: Date.now(),
        ok: data.value.health?.ok ?? false
      }]
    }
    return history.value.map(p => ({
      t: p.t,
      ok: p.ok
    }))
  })

  return {
    players,
    latency,
    uptimeSeries
  }
}
