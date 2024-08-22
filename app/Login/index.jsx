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
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        console.log("logged in session");
        // setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  return (
    <View className="w-full h-full bg-[#E8E5FA] bg-main mt-2 flex flex-col">
      <Image
        className="object-contain w-full h-[60%]"
        source={require("../../assets/images/login.jpg")}
      />
      <View className="w-full h-[40%] flex flex-col">
        <Text className="w-full px-5 pb-2 text-3xl text-center font-outfit-bold">
          Ready to Find Your Furry BFF? 🐕
        </Text>
        <Text className="w-full px-5 text-xl text-center text-gray-600 pb-10 font-outfit">
          Time to adopt a pet and unleash a whole new level of happiness! 🐾✨
        </Text>
        <Pressable
          onPress={onPress}
          className="w-[80%] text-center p-5 bg-purple-950 mx-auto flex items-center rounded-xl"
        >
          <Text className="text-white text-xl font-bold">Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Index;
