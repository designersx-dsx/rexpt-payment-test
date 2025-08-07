// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { indexedDBStorage } from "../utils/indexedDBStorage";

// export const useNotificationStore = create(
//   persist(
//     (set, get) => ({
//       notifications: [],

//       // ➕ Add notification
//       addNotification: (notif) => {
//         set((state) => ({
//           notifications: [notif, ...state.notifications],
//         }));
//       },

//       // 📜 Load old notifications (optional backend call)
//       loadNotifications: (notifs) => {
//         set({ notifications: notifs });
//       },

//       // 🗑️ Clear notifications
//       clearNotifications: () => set({ notifications: [] }),
//     }),
//     {
//       name: "notifications", // IndexedDB key name
//       storage: indexedDBStorage,
//     }
//   )
// );

// store/notificationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { indexedDBStorage } from "../utils/indexedDBStorage";

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (notif) =>
        set((state) => ({
          notifications: [notif, ...state.notifications],
        })),

      loadNotifications: (notifs) =>
        set({
          notifications: Array.isArray(notifs) ? notifs : [],
        }),

      clearNotifications: () => set({ notifications: [] }),
      setNotifications: (newNotifications) => set({ notifications: newNotifications }),
    }),
    {
      name: "notifications",
      storage: indexedDBStorage,
    }
  )
);
