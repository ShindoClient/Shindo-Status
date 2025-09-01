import type { H3Event } from 'h3'

const BASE = process.env.NUXT_PUBLIC_WS_ADMIN_BASE || ''

async function safeFetch(url: string, init?: RequestInit) {
  const t0 = Date.now()
  try {
    const res = await fetch(url, { cache: 'no-store', ...init } as any)
    const latency = Date.now() - t0
    if (!res.ok) return { ok: false, latency, data: null }
    const data = await res.json().catch(() => ({}))
    return { ok: true, latency, data }
  } catch {
    return { ok: false, latency: Date.now() - t0, data: null }
  }
}

// Configura headers para evitar cache
const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

export default defineEventHandler(async (event: H3Event) => {
  // Configura os headers de resposta
  setResponseHeaders(event, noCacheHeaders)
  if (!BASE) {
    return {
      health: { ok: false },
      players: { count: 0 },
      latencyMs: null,
      note: 'Defina NUXT_PUBLIC_WS_ADMIN_BASE no ambiente.'
    }
  }

  const base = BASE.replace(/\/$/, '')

  // tenta health (HEAD)
  const healthUrl = `${base}/v1/health`
  let hasHealth = false
  try {
    const h = await fetch(healthUrl, { method: 'HEAD', cache: 'no-store' } as any)
    hasHealth = h.ok
  } catch {}

  let health = { ok: false as boolean, startedAt: undefined as string | undefined, uptimeMs: undefined as number | undefined }
  let latencyMs: number | null = null

  if (hasHealth) {
    const h = await safeFetch(healthUrl)
    latencyMs = h.latency
    if (h.ok && h.data) {
      const startedAt = h.data.startedAt || undefined
      const uptimeMs = typeof h.data.uptimeMs === 'number' ? h.data.uptimeMs : undefined
      health = { ok: true, startedAt, uptimeMs }
    } else {
      health = { ok: false, startedAt: undefined, uptimeMs: undefined }
    }
  } else {
    const cu = await safeFetch(`${base}/v1/connected-users`)
    latencyMs = cu.latency
    health = { ok: cu.ok, startedAt: undefined, uptimeMs: undefined }
  }

  const users = await safeFetch(`${base}/v1/connected-users`)
  const count = users.ok && (users.data as any)?.users ? Number((users.data as any).users.length) : 0

  return {
    health,
    players: { count },
    latencyMs,
    timestamp: new Date().toISOString() // Adiciona um timestamp para garantir respostas únicas
  }
})
