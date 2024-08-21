import { View, FlatList, Text, Image, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebase-config";

const PetListCategory = () => {
  const [categoryData, setCategoryData] = useState([]);

  const getPetList = async (category) => {
    const petQuery = query(
      collection(db, "pets"),
      where("category", "==", "🐶 Dogs")
    );
    const snapshot = await getDocs(petQuery);
    const pets = snapshot.docs.map((doc) => doc.data());
    setCategoryData(pets);
  };

  useEffect(() => {
    getPetList("🐶 Dogs"); 
  }, []);

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-lg shadow-md mr-4 mb-4" style={{ width: (Dimensions.get('window').width / 2) - 20 }}>
      <Image
        source={{ uri: item.imageURL }}
        className="w-full h-36 object-cover rounded-t-lg"
      />
      <View className='p-4'>
        <Text className='text-xl font-bold'>{item.name}</Text>
        <Text className='text-sm text-gray-600'>{item.breed}</Text>
      </View>
    </View>
  );

  return (
    <View className="w-full px-2">
      <Category
        getPetCategory={(category) => {
          getPetList(category);
        }}
      />
      <FlatList
        data={categoryData}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        style={{ width: Dimensions.get('window').width }}
      />
    </View>
  );
};

export default PetListCategory;
