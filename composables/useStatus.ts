export function useStatus(opts?: { lazy?: boolean; server?: boolean }) {
    return useFetch('/api/status', { lazy: opts?.lazy ?? true, server: opts?.server ?? false, immediate: true })
}
