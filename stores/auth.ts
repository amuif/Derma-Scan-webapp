import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user: User | null) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-user-storage",
      // Use localStorage in Next.js / web
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
