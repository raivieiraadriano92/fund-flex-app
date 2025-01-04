import { useState } from "react";

import * as AppleAuthentication from "expo-apple-authentication";

import { supabase } from "~/core/api/supabase";

export function useAuth({ onError }: { onError: (e: unknown) => void }) {
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    apple: false,
    google: false,
    anonymous: false
  });

  const signInWithApple = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, apple: true }));

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });

      // Sign in via Supabase Auth.
      if (credential.identityToken) {
        const {
          error,
          data: { user }
        } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken
        });

        console.log(JSON.stringify({ error, user }, null, 2));

        if (!error) {
          // User is signed in.
        }
      } else {
        throw new Error("No identityToken.");
      }
    } catch (e) {
      // if (e.code === "ERR_REQUEST_CANCELED") {
      //   // handle that the user canceled the sign-in flow
      // } else {
      //   // handle other errors
      // }

      onError(e);
    } finally {
      setIsLoading((prev) => ({ ...prev, apple: false }));
    }
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
      onError(err);
    } finally {
      setIsLoading((prev) => ({ ...prev, anonymous: false }));
    }
  };

  return {
    isLoading,
    signInWithApple,
    signInWithGoogle,
    signInAnonymously
  };
}
