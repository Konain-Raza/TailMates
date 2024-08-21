import { Pressable, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { Link, Redirect } from "expo-router";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const { user } = useUser();

  useEffect(() => {
    checkNavigationLoaded();
  }, []);

  const checkNavigationLoaded = () => {
    if (!rootNavigationState.key) {
      console.log("Navigation is not loaded yet.");
      return null;
    }
  };


  return (
    <View className="flex-1 ">
      <Text className="text-black">
        {user?.fullName || "Guest"}
      </Text>
      {user ? <Redirect href={"/(tabs)/home"} /> : <Redirect href={"/Login"} />}
    </View>
  );
}
