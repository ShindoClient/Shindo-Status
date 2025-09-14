import { ref, computed } from 'vue'

export interface OnlinePlayer {
  uuid: string
  name: string
  accountType: 'MICROSOFT' | 'OFFLINE'
  lastSeen: number
  roles?: 'Member' | 'Gold' | 'Diamond' | 'Staff'
}

export function useOnlinePlayers(baseUrl: string) {
  const players = ref<OnlinePlayer[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Ensure the base URL doesn't end with a slash
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const apiUrl = `${normalizedBaseUrl}/v1/connected-users`

  const fetchPlayers = async () => {
    if (!baseUrl) {
      error.value = new Error('Base URL is not configured')
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch online players: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()

      if (data.success && Array.isArray(data.users)) {
        // Transform the API response to match our interface
        players.value = data.users.map((user: any) => {
          // Normalize account type to uppercase
          const accountType = (user.accountType || '').toUpperCase() as 'MICROSOFT' | 'OFFLINE'
          // Normalize role with first letter uppercase and the rest lowercase
          const rawRole = (user.roles || 'member').toString()
          const normalizedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase() as 'Member' | 'Gold' | 'Diamond' | 'Staff'
          
          return {
            ...user,
            accountType: accountType === 'MICROSOFT' || accountType === 'OFFLINE' 
              ? accountType 
              : 'OFFLINE', // Default to OFFLINE if invalid
            roles: ['Staff', 'Diamond', 'Gold', 'Member'].includes(normalizedRole) 
              ? normalizedRole 
              : 'Member' // Default to Member if invalid
          }
        })
      }
    } catch (err) {
      console.error('Error fetching online players:', err)
      error.value = err instanceof Error ? err : new Error('Unknown error')
    } finally {
      loading.value = false
    }
  }

  // Group players by rank for display
  const playersByRank = computed(() => {
    const groups: Record<string, OnlinePlayer[]> = {
      Staff: [],
      Diamond: [],
      Gold: [],
      Member: []
    }

    players.value.forEach(player => {
      // Normalize the role for case-insensitive comparison
      const playerRole = player.roles || 'member'
      const normalizedRole = typeof playerRole === 'string' ? playerRole.toLowerCase() : 'member'
      
      // Define the rank with a type guard
      let rank: 'Staff' | 'Diamond' | 'Gold' | 'Member' = 'Member'
      
      // Find the correct rank with case-insensitive comparison
      if (normalizedRole.includes('staff')) {
        rank = 'Staff'
      } else if (normalizedRole.includes('diamond')) {
        rank = 'Diamond'
      } else if (normalizedRole.includes('gold')) {
        rank = 'Gold'
      }
      
      // Ensure the group exists before pushing
      const targetGroup = groups[rank] || []
      targetGroup.push(player)
      groups[rank] = targetGroup
    })

    // Sort each group by player name
    Object.values(groups).forEach(group => {
      group.sort((a, b) => a.name.localeCompare(b.name))
    })

    return groups
  })

  return {
    players,
    playersByRank,
    loading,
    error,
    fetchPlayers
  }
}
