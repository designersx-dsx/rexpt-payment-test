// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// export const useDashboardStore = create(
//   persist(
//     (set) => ({
//       agents: [],
//       totalCalls: 0,
//       setDashboardData: (agents, totalCalls) => set({ agents, totalCalls }),
//     }),
//     {
//       name: 'dashboard-session-storage',
//       storage: {
//         getItem: (name) => {
//           const value = sessionStorage.getItem(name)
//           return value ? JSON.parse(value) : null
//         },
//         setItem: (name, value) => {
//           sessionStorage.setItem(name, JSON.stringify(value))
//         },
//         removeItem: (name) => {
//           sessionStorage.removeItem(name)
//         },
//       },
//     }
//   )
// )

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDashboardStore = create(
  persist(
    (set) => ({
      agents: [],
      totalCalls: 0,
      hasFetched: false,

      // ✅ Set dashboard data and mark as fetched
      setDashboardData: (agents, totalCalls) =>
        set({ agents, totalCalls, hasFetched: true }),

      // ✅ Set hasFetched manually
      setHasFetched: (value) => set({ hasFetched: value }),

      // ✅ Reset the store completely
      reset: () =>
        set({
          agents: [],
          totalCalls: 0,
          hasFetched: false,
        }),
    }),
    {
      name: 'dashboard-session-storage',

      // ✅ Only persist actual data (not runtime flags like hasFetched)
      partialize: (state) => ({
        agents: state.agents,
        totalCalls: state.totalCalls,
      }),

      // ✅ Use sessionStorage (not localStorage)
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
