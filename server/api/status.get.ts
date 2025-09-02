import { defineEventHandler, getMethod, setHeaders, setResponseStatus } from 'h3'

const BASE = process.env.NUXT_PUBLIC_WS_ADMIN_BASE || ''

async function safeFetch(url: string, init?: RequestInit) {
    const controller = new AbortController()
    const t0 = Date.now()
    const timeout = setTimeout(() => controller.abort(), 3500)
    try {
        const res = await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' } as any)
        clearTimeout(timeout)
        const latency = Date.now() - t0
        if (!res.ok) return { ok: false, latency, data: null }
        const data = await res.json().catch(() => ({}))
        return { ok: true, latency, data }
    } catch {
        clearTimeout(timeout)
        return { ok: false, latency: Date.now() - t0, data: null }
    }
}

export default defineEventHandler(async (event) => {
    // CORS
    const cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    }

    if (getMethod(event) === 'OPTIONS') {
        setHeaders(event, cors)
        setResponseStatus(event, 204)
        return null
    }

    setHeaders(event, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        ...cors,
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
    // tenta health
    const h = await safeFetch(`${base}/v1/health`)
    let latencyMs = h.latency
    let health = { ok: false as boolean, startedAt: undefined as string | undefined, uptimeMs: undefined as number | undefined }
    if (h.ok && h.data) {
        const d: any = h.data
        health = {
            ok: d?.ok === true || d === true,
            startedAt: d?.startedAt || undefined,
            uptimeMs: typeof d?.uptimeMs === 'number' ? d.uptimeMs : undefined,
        }
    } else {
        const cu = await safeFetch(`${base}/v1/connected-users`)
        latencyMs = cu.latency
        health = { ok: cu.ok, startedAt: undefined, uptimeMs: undefined }
    }

    const users = await safeFetch(`${base}/v1/connected-users`)
    const count = users.ok && (users.data as any)?.users ? Number((users.data as any).users.length) : 0

    return { health, players: { count }, latencyMs, timestamp: new Date().toISOString() }
})
