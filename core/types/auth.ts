import type { Session } from "@supabase/supabase-js";

export type AuthState = {
  session: Session | null | undefined;
};

export type AuthStore = AuthState & {
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  markAccountToBeDeleted: () => Promise<void>;
};
