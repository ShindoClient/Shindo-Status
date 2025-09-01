import { ref, watchEffect } from 'vue'

type Point = { t: number, count: number, latency: number | null }

const MAX_POINTS = 60 // ~10s * 60 = 10 min

export function useStatusHistory(data: Ref<any>, pending: Ref<boolean>) {
  const players = ref<Point[]>([])
  const latency = ref<Point[]>([])

  watchEffect(() => {
    if (pending.value) return
    const now = Date.now()
    const count = Number(data.value?.players?.count ?? 0)
    const lat = data.value?.latencyMs ?? null
    players.value.push({ t: now, count, latency: lat })
    latency.value.push({ t: now, count, latency: lat })

    if (players.value.length > MAX_POINTS) players.value.splice(0, players.value.length - MAX_POINTS)
    if (latency.value.length > MAX_POINTS) latency.value.splice(0, latency.value.length - MAX_POINTS)
  })

  return { players, latency }
}
