import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { View, StatusBar, Alert, ActivityIndicator } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require("../assets/fonts/Outfit-Regular.ttf"),
    'outfit-medium': require("../assets/fonts/Outfit-Medium.ttf"),
    'outfit-bold': require("../assets/fonts/Outfit-Bold.ttf"),
  });

  const tokenCache = {
    async getToken(key) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    async saveToken(key, value) {
      try {
        return await SecureStore.setItemAsync(key, value);
      } catch (err) {
        console.error("SecureStore save item error: ", err);
      }
    },
  };

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    Alert.alert("Configuration Error", "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
    throw new Error("Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
  }

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="Login/index" options={{ headerShown: false }} />
          <Stack.Screen name="Chat/index" options={{ headerShown: true }} />
          <Stack.Screen name="AddPet/index" options={{ headerShown: true }} />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
