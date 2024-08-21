import { View, Text, FlatList, TouchableOpacity } from "react-native"; // Corrected TouchableOpacity
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Ensure correct Firestore import
import { db } from "../../app/firebase-config"; // Ensure db is imported correctly

const Category = ({getPetCategory}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setCategories([]); // Clear categories before fetching
    const snapshot = await getDocs(collection(db, "categories"));
    snapshot.forEach((document) => {
      if (document.exists()) {
        setCategories((categories) => [...categories, document.data()]);
      }
    });
  };

  return (
    <View className="font-outfit w-full mt-5 h-max mb-5 flex flex-col">
      <Text className="text-xl font-outfit-bold">Category</Text>
      <FlatList
        data={categories}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(index);
                getPetCategory(item.name);
              }}
              className={`mt-3 text-2xl w-max h-14 rounded-xl flex items-center justify-center px-4 mr-3 ${
                selectedCategory === index
                  ? "bg-[#954FEF] text-white"
                  : "bg-[#F1E8FD] text-gray-600"
              }`}
              key={index}
            >
              <Text
                className={`text-xl font-outfit-bold ${
                  selectedCategory === index ? "text-white" : "text-gray-600"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Category;
