import { useEffect, useState } from "react";

import {
  GoogleSignin
  // statusCodes
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";

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
    try {
      setIsLoading((prev) => ({ ...prev, google: true }));

      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken
        });

        console.log(error, data);
      } else {
        throw new Error("no ID token present!");
      }
    } catch (e) {
      console.error(e);
      // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      //   // user cancelled the login flow
      // } else if (error.code === statusCodes.IN_PROGRESS) {
      //   // operation (e.g. sign in) is in progress already
      // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      //   // play services not available or outdated
      // } else {
      //   // some other error happened
      // }

      onError(e);
    } finally {
      setIsLoading((prev) => ({ ...prev, google: false }));
    }
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

  useEffect(() => {
    if (Platform.OS === "android") {
      GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/drive.readonly"]
        // webClientId: "YOUR CLIENT ID FROM GOOGLE CONSOLE"
      });
    }
  }, []);

  return {
    isLoading,
    signInWithApple,
    signInWithGoogle,
    signInAnonymously
  };
}
