import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { supabase } from '~/core/api/supabase';
import type { AuthStore } from '~/core/types/auth';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: undefined,

      setSession: (session) => set({ session }),

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ session: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ session: state.session }),
    }
  )
);
