// stores/agentStore.js
import { create } from "zustand";

// Utility to fetch persisted and non-expired data from sessionStorage
const getPersistedData = (key) => {
  const stored = sessionStorage.getItem(key);
  if (!stored) return null;

  try {
    const { data, timestamp } = JSON.parse(stored);
    if (Date.now() - timestamp < 30 * 60 * 1000) {
      return data; // Valid (not expired)
    }
    sessionStorage.removeItem(key); // Remove expired
    return null;
  } catch {
    sessionStorage.removeItem(key); // In case of corruption
    return null;
  }
};

export const useAgentStore = create((set) => ({
  agentData: getPersistedData("agentData") || null,
  assignedNumbers: getPersistedData("assignedNumbers") || [],
  totalBookings: getPersistedData("totalBookings") || 0,

  setAgentData: (data) => {
    sessionStorage.setItem(
      "agentData",
      JSON.stringify({ data, timestamp: Date.now() })
    );
    set({ agentData: data });
  },

  setAssignedNumbers: (numbers) => {
    sessionStorage.setItem(
      "assignedNumbers",
      JSON.stringify({ data: numbers, timestamp: Date.now() })
    );
    set({ assignedNumbers: numbers });
  },

  setTotalBookings: (count) => {
    sessionStorage.setItem(
      "totalBookings",
      JSON.stringify({ data: count, timestamp: Date.now() })
    );
    set({ totalBookings: count });
  },

  clearAll: () => {
    ["agentData", "assignedNumbers", "totalBookings"].forEach((key) =>
      sessionStorage.removeItem(key)
    );
    set({
      agentData: null,
      assignedNumbers: [],
      totalBookings: 0,
    });
  },
}));
