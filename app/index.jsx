import { Pressable, Text, View, ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  const { user } = useUser();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (rootNavigationState && !rootNavigationState.key) {
      console.log("Navigation is not loaded yet.");
    }
  }, [rootNavigationState]);

  // Check if rootNavigationState is undefined
  if (!rootNavigationState) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-black">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      <Text className="text-black">
        {user?.fullName || "Guest"}
      </Text>
      {user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/Login" />}
    </ScrollView>
  );
}
