import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";

const Profile = () => {
  const { user } = useUser();
  const router=useRouter();
  const navigation = useNavigation();
  const {signOut} = useAuth();

  const menu = [
    {
      id: 1,
      title: "Add New Pet",
      icon: "add-circle",
      pathname: "/AddPet",
    },
    {
      id: 1,
      title: "My Posts",
      icon: "add-circle",
      pathname: "/AddPet",
    },
    {
      id: 2,
      title: "Favourites",
      icon: "heart",
      pathname: "(tabs)/favourites",
    },
    {
      id: 3,
      title: "Inbox",
      icon: "chatbubble",
      pathname: "(tabs)/inbox",
    },
    {
      id: 4,
      title: "Logout",
      icon: "exit",
      pathname: "logout",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center p-5  mb-5 bg-white w-[90%] mx-auto rounded-lg justify-between"
      onPress={() => {
        if(item.pathname=="logout"){
          signOut();
          router.push("/Login");
        }else{
          router.push(item.pathname)

        }
      }}
    >
      <View className='bg-purple-300 p-3 rounded-xl'>
      <Ionicons name={item.icon} size={30} color="black" className="mr-2" />
      </View>
      <View className="w-[75%] flex-row justify-between">
        <Text className=" text-xl font-outfit-medium text-black">{item.title}</Text>
        <Ionicons name="chevron-forward" size={30} color="purple" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-purple-100">
      <View className="items-center mt-10 mb-10">
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-24 h-24 rounded-full mb-5"
        />
        <Text className="text-2xl font-bold text-black">{user?.fullName}</Text>
        <Text className="text-lg text-gray-900">
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Profile;
