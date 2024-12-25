import { View } from "react-native";

import { H2 } from "~/components/ui/typography";
// import { supabase } from "~/core/api/supabase";

export default function HomeScreen() {
  // supabase.auth.signOut();
  return (
    <View className="flex-1 px-4 py-3">
      <H2>Home</H2>
    </View>
  );
}
