import { useState } from "react";

import { supabase } from "~/core/api/supabase";

export function useAuth() {
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    apple: false,
    google: false,
    anonymous: false
  });

  const [error, setError] = useState<string | null>(null);

  const signInWithApple = async () => {
    throw new Error("Not implemented");

    // try {
    //   setIsLoading((prev) => ({ ...prev, apple: true }));

    //   // @todo implement Apple sign-in
    //   // const { error } = await supabase.auth.signInAnonymously();

    //   // if (error) throw error;
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setIsLoading((prev) => ({ ...prev, apple: false }));
    // }
  };

  const signInWithGoogle = async () => {
    throw new Error("Not implemented");

    // try {
    //   setIsLoading((prev) => ({ ...prev, google: true }));

    //   // @todo implement Google sign-in
    //   // const { error } = await supabase.auth.signInAnonymously();

    //   // if (error) throw error;
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setIsLoading((prev) => ({ ...prev, google: false }));
    // }
  };

  const signInAnonymously = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, anonymous: true }));

      const { error } = await supabase.auth.signInAnonymously();

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, anonymous: false }));
    }
  };

  return {
    isLoading,
    error,
    signInWithApple,
    signInWithGoogle,
    signInAnonymously
  };
}
