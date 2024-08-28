import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";

const Header = () => {
  const [imageUrl, setImageURL] = useState("");
  const { user } = useUser();

  useEffect(() => {
    setImageURL(user?.imageUrl || "https://example.com/placeholder.png");
  }, [user]);
  return (
    <View className=" w-full h-[13vh] flex items-center flex-row justify-between px-2">
      <View className="flex flex-colitems-start justify-center">
        <Text className="text-xl leading-none p-0 font-outfit-medium text-gray-700">
          Welcome 👋
        </Text>
        <Text className="text-2xl m-0 p-0 font-outfit-bold">
          {user?.fullName}
        </Text>
      </View>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl || "" }}
          style={{ width: 50, height: 50, borderRadius: 20, marginLeft: 10 }} // Adjust size and style as needed
        />
      ) : (
        <Text>No Image Available</Text>
      )}
    </View>
  );
};

export default Header;
