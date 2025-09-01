import { ref, watchEffect } from 'vue'

type Point = { t: number, count: number, latency: number | null }

const MAX_POINTS = 60 // ~10s * 60 = 10 min

export function useStatusHistory(data: Ref<any>, pending: Ref<boolean>) {
  const players = ref<Point[]>([])
  const latency = ref<Point[]>([])

  watchEffect(() => {
    try {
      if (pending.value || !data.value) return

      const now = Date.now()
      const count = data.value?.players?.count ?? 0
      const lat = data.value?.latencyMs ?? null

      // Garante que os valores são números válidos
      const safeCount = Number.isFinite(count) ? count : 0
      const safeLat = Number.isFinite(lat) ? Number(lat) : null

      players.value.push({ t: now, count: safeCount, latency: safeLat })
      latency.value.push({ t: now, count: safeCount, latency: safeLat })

      // Remove pontos antigos se exceder o máximo
      if (players.value.length > MAX_POINTS) players.value.shift()
      if (latency.value.length > MAX_POINTS) latency.value.shift()
    } catch (error) {
      console.error('Erro em useStatusHistory:', error)
      // Mantém os dados anteriores em caso de erro
    }
  })

  return { players, latency }
}
