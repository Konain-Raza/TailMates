import { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Pressable, Image } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

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
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL("(tabs)/home", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        console.log("Logged in session");
        // setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  return (
    <View className="flex-1 bg-[#E8E5FA] mt-2 flex flex-col">
      <Image
        className="w-full h-1/2 object-cover mt-10"
        source={require("../../assets/images/login.jpg")}
      />
      <View className=" h-[40%] flex flex-col justify-center px-4">
        <Text className="text-4xl text-center font-outfit-bold mb-2">
          Discover Your Purrfect Partner! 🐾
        </Text>
        <Text className="text-xl text-center text-gray-600 mb-10 font-outfit">
          Adopt your next adventure buddy and let the tail-wagging begin! 🐶💖
        </Text>

        <Pressable
          onPress={onPress}
          className="w-[90%] mx-auto bg-purple-950 p-5 rounded-xl items-center"
        >
          <Text className="text-white text-xl font-bold">Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Index;
