import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useRootNavigationState } from "expo-router";

export default function Index() {
  const { user } = useUser();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (rootNavigationState && !rootNavigationState.key) {
      
    }
  }, [rootNavigationState]);

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/Login" />;
  }
}
