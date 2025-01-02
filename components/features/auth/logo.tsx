import { Image } from "react-native";

export function Logo() {
  return (
    <Image
      source={require("~/assets/icon.png")}
      className="h-60 w-60 rounded-3xl"
      resizeMode="contain"
    />
  );
}
