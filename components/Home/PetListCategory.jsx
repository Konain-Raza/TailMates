import { View, FlatList, Text, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebase-config";
import PetCard from "./PetCard";
import Category from "./Category";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "@react-navigation/native";

const PetListCategory = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("🐶 Dogs");
  const { user } = useUser();

  const getPetList = async (selectedCategory) => {
    setLoading(true);
    const petQuery = query(
      collection(db, "pets"),
      where("category", "==", selectedCategory)
    );
    const snapshot = await getDocs(petQuery);
    if (!snapshot.empty) {
      const pets = snapshot.docs.map((doc) => doc.data());
      setCategoryData(pets);
    } else {
      setCategoryData([]);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getPetList(category);
    }, [user])
  );

  useEffect(() => {
    getPetList(category);
  }, [category]);

  return (
    <View className="w-full px-2  flex-1">
      <Category
        getPetCategory={(category) => {
          getPetList(category);
        }}
      />
      <FlatList
        data={categoryData}
        renderItem={({ item }) => (
          <View className="w-[49%] p-1 mb-2">
            <PetCard item={item} />
          </View>
        )}
        numColumns={2}
        refreshing={loading}
        onRefresh={() => getPetList(category)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={() => (
          <View className="flex-col items-center justify-center w-full rounded-2xl h-[25vh] px-10">
            <Text className="text-lg text-center font-outfit-bold text-gray-800 mt-4">
              No pets here! 🐾 They must be playing hide and seek! 🕵️‍♂️
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default PetListCategory;
