import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../app/firebase-config";
import { useNavigation } from "expo-router";
import { Alert } from "react-native";

const Category = ({ getPetCategory }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      const categoriesArray = [];

      snapshot.forEach((document) => {
        if (document.exists()) {
          categoriesArray.push(document.data());
        }
      });

      setCategories(categoriesArray.reverse());
    } catch (error) {
      Alert.alert(
        "Error fetching categories: ",
        error.message || error.toString()
      );
 
    }
  };

  return (
    <View className="font-outfit w-full mt-1 mb-1 flex flex-col">
      <View className="w-full flex-row items-center justify-between mb-1">
        <Text className="text-3xl   font-outfit-bold">Category</Text>

        <Pressable
          onPress={() => navigation.navigate("AddPet/index")}
          className="bg-purple-950 p-4 rounded-lg shadow-md hover:bg-purple-600 active:bg-purple-700"
        >
          <Text className="text-white text-md font-outfit-bold text-center">
            Add a Paw-tner! 🐕
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(index);
              getPetCategory(item.name);
            }}
            className={`mt-2 text-2xl w-max h-14 rounded-xl flex items-center justify-center px-3 mr-3 ${
              selectedCategory === index
                ? "bg-[#8640e2] text-white"
                : "bg-purple-300 text-gray-600"
            }`}
          >
            <Text
              className={`text-lg font-outfit-medium ${
                selectedCategory === index ? "text-white" : "text-gray-800"
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Category;
