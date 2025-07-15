// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const useCallHistoryStore = create(
//   persist(
//     (set) => ({
//       callHistory: [],
//       totalCalls: 0,
//       hasFetched: false,

//       // ✅ Set call history and total calls
//       setCallHistoryData: (callHistory, totalCalls) =>
//         set({ callHistory, totalCalls, hasFetched: true }),

//       // ✅ Manually update hasFetched
//       setHasFetched: (value) => set({ hasFetched: value }),

//       // ✅ Reset call history store
//       reset: () =>
//         set({
//           callHistory: [],
//           totalCalls: 0,
//           hasFetched: false,
//         }),
//     }),
//     {
//       name: 'call-history-session-storage',

//       // ✅ Persist only call history and totalCalls
//       partialize: (state) => ({
//         callHistory: state.callHistory,
//         totalCalls: state.totalCalls,
//       }),

//       // ✅ Use sessionStorage
//       storage: {
//         getItem: (name) => {
//           const value = sessionStorage.getItem(name);
//           return value ? JSON.parse(value) : null;
//         },
//         setItem: (name, value) => {
//           sessionStorage.setItem(name, JSON.stringify(value));
//         },
//         removeItem: (name) => {
//           sessionStorage.removeItem(name);
//         },
//       },
//     }
//   )
// );

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { indexedDBStorage } from '../utils/indexedDBStorage';

export const useCallHistoryStore = create(
  persist(
    (set) => ({
      callHistory: [],
      totalCalls: 0,
      hasFetched: false,

      setCallHistoryData: (callHistory, totalCalls) =>
        set({ callHistory, totalCalls, hasFetched: true }),

      setHasFetched: (value) => set({ hasFetched: value }),

      reset: () =>
        set({
          callHistory: [],
          totalCalls: 0,
          hasFetched: false,
        }),
    }),
    {
      name: 'call-history-indexeddb', // DB key
      storage: indexedDBStorage,      // Use IndexedDB
      partialize: (state) => ({
        callHistory: state.callHistory,
        totalCalls: state.totalCalls,
      }),
    }
  )
);
