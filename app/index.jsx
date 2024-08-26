import { ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { useNavigation, Redirect } from "expo-router";

export default function Index() {
  const { user } = useUser();
  const rootNavigationState = useRootNavigationState();
  const navigation = useNavigation();

  useEffect(() => {
    if (rootNavigationState && !rootNavigationState.key) {
      console.log("Navigation is not loaded yet.");
    }
  }, [rootNavigationState]);

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <ScrollView className="flex-1">
      <Redirect href="/Login" />
    </ScrollView>
  );
}
