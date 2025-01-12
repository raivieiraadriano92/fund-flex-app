const getAppInfo = () => {
  switch (process.env.APP_VARIANT) {
    case "production":
      return {
        name: "FundFlex",
        bundleIdentifier: "com.raivieiraadriano92.fundflexapp"
      };

    case "preview":
      return {
        name: "FundFlex (Preview)",
        bundleIdentifier: "com.raivieiraadriano92.fundflexapp.preview"
      };

    default:
      return {
        name: "FundFlex (Dev)",
        bundleIdentifier: "com.raivieiraadriano92.fundflexapp.dev"
      };
  }
};

const { bundleIdentifier, name } = getAppInfo();

export default {
  expo: {
    newArchEnabled: true,
    name,
    slug: "fund-flex-app",
    version: "1.0.0",
    scheme: "fund-flex-app",
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-apple-authentication",
      "@react-native-google-signin/google-signin",
      "@sentry/react-native/expo"
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true
    },
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#EBECF0"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier,
      usesAppleSignIn: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#EBECF0"
      },
      package: bundleIdentifier
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "1289d819-097c-4806-a3a9-99c413785257"
      }
    },
    updates: {
      url: "https://u.expo.dev/1289d819-097c-4806-a3a9-99c413785257"
    },
    runtimeVersion: {
      policy: "appVersion"
    }
  }
};
