import { View, Text, FlatList, TouchableOpacity } from "react-native"; // Corrected TouchableOpacity
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Ensure correct Firestore import
import { db } from "../../app/firebase-config";
import { Link, Redirect } from "expo-router";

const Category = ({ getPetCategory }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setCategories([]);
    const snapshot = await getDocs(collection(db, "categories"));
    snapshot.forEach((document) => {
      if (document.exists()) {
        setCategories((categories) => [...categories, document.data()]);
      }
    });
  };

  return (
    <View className="font-outfit w-full mt-5 h-max mb-5 flex flex-col">
      <View className='w-full flex-row justify-between'>
        <Text className="text-2xl font-outfit-bold">Category</Text>
        <Link href={'/AddPet'}>
          <Text>Add New Pet</Text>
        </Link>
      </View>
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
              className={`mt-3 text-2xl w-max h-14 rounded-xl flex items-center justify-center px-3 mr-3 ${
                selectedCategory === index
                  ? "bg-[#954FEF] text-white"
                  : "bg-[#F1E8FD] text-gray-600"
              }`}
              key={index}
            >
              <Text
                className={`text-lg font-outfit-medium ${
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
