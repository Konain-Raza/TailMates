import { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Pressable, Image } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Alert } from "react-native";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const Index = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId ,setActive} = await startOAuthFlow({
        redirectUrl: Linking.createURL("(tabs)/home", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        setActive({ session: createdSessionId });

      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      Alert.alert(
        "Error fetching favourites:",
        err.message || err.toString()
      );
      
    
    }
  }, [startOAuthFlow]);

  return (
    <View className="flex-1 bg-[#E8E5FA] 1 48  flex flex-col">
      <Image
        className="w-full h-1/2 object-cover mt-10"
        source={require("../../assets/images/login.jpg")}
      />
      <View className=" h-[40%] flex flex-col justify-center px-5 mt-10">
        <Text className="text-3xl text-center font-outfit-bold mb-2 p-3">
        Need Cuddles? Get a Pet Buddy! 🐾✨
        </Text>
        <Text className="text-xl px-2 text-center text-gray-600 font-outfit-bold">
          Adopt your next adventure buddy and let the tail-wagging begin! 🐶💖
        </Text>

        <Pressable
          onPress={onPress}
          className="w-[90%] mx-auto bg-purple-950 p-5 my-10 rounded-2xl items-center"
        >
          <Text className="text-white text-2xl font-bold">Get Started 🌈</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Index;
