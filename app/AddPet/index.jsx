import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Index = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });
  }, [navigation]);

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-black text-2xl mb-4">Add New Pet</Text>
      <TouchableOpacity className="h-48 bg-gray-200 justify-center items-center mb-4">
        <Text className="text-gray-500">Select an image</Text>
      </TouchableOpacity>
      <View className="w-full px-4">
        <TextInput
          placeholder="Name"
          className="border border-gray-300 rounded-lg p-3 mb-4 text-white"
          placeholderTextColor="gray"
        />
           <View className='w-full flex-row justify-between'>
          <TextInput
            placeholder="Category"
            className="border border-gray-300 rounded-lg p-3 mb-4 w-[48%] text-white"
            placeholderTextColor="gray"
          />
          <TextInput
            placeholder="Gender"
            className="border border-gray-300 rounded-lg p-3 mb-4 w-[48%] text-white"
            placeholderTextColor="gray"
          />
        </View>
        <View className='w-full flex-row justify-between'>
          <TextInput
            placeholder="Age"
            className="border border-gray-300 rounded-lg p-3 mb-4 w-[30%] text-white"
            placeholderTextColor="gray"
          />
          <TextInput
            placeholder="Breed"
            className="border border-gray-300 rounded-lg p-3 mb-4 w-[67%] text-white"
            placeholderTextColor="gray"
          />
        </View>
   
     

        <TextInput
          placeholder="About"
          className="border border-gray-300 rounded-lg p-3 mb-4 text-white  w-full"
          placeholderTextColor="gray"
        />
        <TextInput
          placeholder="Weight"
          className="border border-gray-300 rounded-lg p-3 mb-4 text-white"
          placeholderTextColor="gray"
        />
      </View>
    </ScrollView>
  );
};

export default Index;
