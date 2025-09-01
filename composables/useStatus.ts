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
  return useFetch<StatusResponse>('/api/status', { 
    lazy: opts?.lazy ?? true, 
    server: opts?.server ?? false, 
    immediate: true,
    onResponseError: (error) => {
      console.error('Erro ao buscar status:', error)
    }
  })
}
