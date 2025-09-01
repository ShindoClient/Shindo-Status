interface StatusResponse {
  health?: {
    ok: boolean;
    startedAt?: string;
    uptimeMs?: number;
  };
  players?: {
    count: number;
  };
  latencyMs?: number | null;
  note?: string;
}

export function useStatus(opts?: { lazy?: boolean; server?: boolean }) {
  const headers = new Headers()
  headers.append('Cache-Control', 'no-cache, no-store, must-revalidate')
  headers.append('Pragma', 'no-cache')
  headers.append('Expires', '0')

  return useFetch<StatusResponse>('/api/status', { 
    lazy: opts?.lazy ?? true, 
    server: opts?.server ?? false, 
    immediate: true,
    headers,
    key: 'status-' + Date.now(), // Força uma nova requisição a cada chamada
    onResponseError: (error) => {
      console.error('Erro ao buscar status:', error)
    }
  })
}
