import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDashboardStore = create(
  persist(
    (set) => ({
      agents: [],
      totalCalls: 0,
      setDashboardData: (agents, totalCalls) => set({ agents, totalCalls }),
    }),
    {
      name: 'dashboard-session-storage',
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name)
        },
      },
    }
  )
)
