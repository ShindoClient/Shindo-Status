// server/api/status.get.ts
import { defineEventHandler, getMethod, setHeaders, setResponseStatus } from 'h3'

const BASE = process.env.NUXT_PUBLIC_WS_ADMIN_BASE || ''

async function safeFetch(url: string, init?: RequestInit) {
    // timeouts curtos para Edge (3.5s)
    const controller = new AbortController()
    const t0 = Date.now()
    const timeout = setTimeout(() => controller.abort(), 3500)
    try {
        const res = await fetch(url, {
            ...init,
            signal: controller.signal,
            cache: 'no-store',
            // sem forçar content-type aqui; GET não precisa
        } as any)
        clearTimeout(timeout)
        const latency = Date.now() - t0
        if (!res.ok) return { ok: false, latency, data: null }
        const data = await res.json().catch(() => ({}))
        return { ok: true, latency, data }
    } catch (e) {
        clearTimeout(timeout)
        return { ok: false, latency: Date.now() - t0, data: null }
    }
}

export default defineEventHandler(async (event) => {
    // CORS (Edge-friendly)
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    }

    // Preflight
    if (getMethod(event) === 'OPTIONS') {
        setHeaders(event, corsHeaders)
        setResponseStatus(event, 204)
        return null
    }

    setHeaders(event, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        ...corsHeaders,
    })

    if (!BASE) {
        return {
            health: { ok: false, error: 'NUXT_PUBLIC_WS_ADMIN_BASE not set' },
            players: { count: 0 },
            latencyMs: null,
            timestamp: new Date().toISOString(),
        }
    }

    const base = BASE.replace(/\/$/, '')

    // Tenta /v1/health rapidamente; se falhar, usa connected-users como health
    let health = { ok: false as boolean, startedAt: undefined as string | undefined, uptimeMs: undefined as number | undefined }
    let latencyMs: number | null = null

    const h = await safeFetch(`${base}/v1/health`)
    latencyMs = h.latency
    if (h.ok && h.data) {
        const data: any = h.data
        health = {
            ok: data?.ok === true || data === true,
            startedAt: data?.startedAt || undefined,
            uptimeMs: typeof data?.uptimeMs === 'number' ? data.uptimeMs : undefined,
        }
    } else {
        // fallback: apenas marca ok se /v1/connected-users responde
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
        timestamp: new Date().toISOString(),
    }
})
