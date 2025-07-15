// utils/indexedDBStorage.js
import { get, set, del } from 'idb-keyval';

export const indexedDBStorage = {
  getItem: async (name) => {
    const value = await get(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await set(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await del(name);
  },
};
