import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";

const Profile = () => {
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useAuth();

  const menu = [
    {
      id: 1,
      title: "Add New Pet",
      icon: "add-circle",
      pathname: "/AddPet",
    },
    {
      id: 2,
      title: "My Posts",
      customicon: <FontAwesome5 name="dog" size={30} color="black" />,
      pathname: "/../MyPosts",
    },
    {
      id: 3,
      title: "Favourites",
      icon: "heart",
      pathname: "(tabs)/favourites",
    },
    {
      id: 4,
      title: "Inbox",
      icon: "chatbubble",
      pathname: "(tabs)/inbox",
    },
    {
      id: 5,
      title: "Logout",
      icon: "exit",
      pathname: "logout",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center p-3 mb-3 bg-white shadow-xl w-[85%] mx-auto rounded-2xl justify-between"
      onPress={async () => {
        if (item.pathname === "logout") {
          await signOut();
          router.push("/Login");
        } else {
          router.push(item.pathname);
        }
      }}
    >
      <View className="bg-purple-300 p-3 rounded-xl">
        {item.customicon ? (
          item.customicon
        ) : (
          <Ionicons name={item.icon} size={30} color="black" className="mr-2" />
        )}
      </View>
      <View className="w-[75%] flex-row justify-between">
        <Text className="text-xl font-semibold text-black">
          {item.title}
        </Text>
        <Ionicons name="chevron-forward" size={30} color="purple" />
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1 pt-4 bg-gray-100">
      <View className="items-center mt-10 mb-5">
        <Image
          source={{ uri: user.imageUrl  }}
          className="w-24 h-24 rounded-full mb-1"
        />
        <Text className="text-2xl font-bold text-black">{user.fullName}</Text>
        <Text className="text-lg text-gray-700">
          {user.primaryEmailAddress?.emailAddress || "No email provided"}
        </Text>
      </View>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Profile;
