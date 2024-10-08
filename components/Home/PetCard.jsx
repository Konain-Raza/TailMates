import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const PetCard = ({ item }) => {
  const router = useRouter();


  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-lg  mb-2 "
      onPress={() =>
        router.push({
          pathname: "/PetDetails",
          params: { ...item, imageURL: encodeURIComponent(item.imageURL) },
        })
      }
    >
      {item.imageURL?(
        <Image
        source={{ uri: item.imageURL || ""}}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      ):
      <Text>No Image Available</Text>
      }
      
      <View className="py-2 px-3">
        <Text className="text-xl font-outfit-bold text-gray-800">
          {item.name}
        </Text>
        <View className="w-full h-10 flex-row flex items-center justify-start gap-2">
          <Text className="font-outfit text-blue-700 text bg-blue-300 w-max p-1.5 rounded-md">
            {item.gender}
          </Text>
          <Text className="font-outfit text-yellow-600 text bg-orange-200 w-max p-1.5 rounded-md">
            {item.age} yrs
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PetCard;
