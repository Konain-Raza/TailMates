import { View, Text, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

const Header = () => {
  const { user } = useUser();
  const imageUrl = user?.imageUrl || "https://example.com/placeholder.png"; // Define imageUrl here

  return (
    <View className=" w-full h-[10%] flex items-center flex-row justify-between">
      <View className="flex flex-colitems-start justify-center">
        <Text className="text-xl  m-0 p-0 font-outfit">Welcome</Text>
        <Text className="text-xl m-0 p-0 font-outfit-bold">{user?.fullName}</Text>
      </View>
      <Image
        source={{ uri: imageUrl }}
        style={{ width: 45, height: 45, borderRadius: 20, marginLeft: 10 }} // Adjust size and style as needed
      />
    </View>
  );
};

export default Header;
