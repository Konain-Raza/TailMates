import { View, FlatList, Text, Image, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebase-config";
import { TouchableOpacity } from "react-native-gesture-handler";
import PetCard from "./PetCard";
const PetListCategory = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false)

  const getPetList = async (category) => {
    setLoading(true);
    const petQuery = query(
      collection(db, "pets"),
      where("category", "==", category)
    );
    const snapshot = await getDocs(petQuery);
    if (!snapshot.empty) {
      const pets = snapshot.docs.map((doc) => doc.data());
      setCategoryData(pets);
    } else {
      console.log("pet not found")
      setCategoryData([])
    }
    setLoading(false);

  };

  useEffect(() => {
    getPetList("🐶 Dogs");
  }, []);



  return (
    <View className="w-full px-2">
      <Category
        getPetCategory={(category) => {
          getPetList(category);
        }}
      />
      <FlatList
      className=' p-2'
        data={categoryData}
        renderItem={({item,index})=>{
          return<PetCard item={item}/>
        }}
        numColumns={2}
        refreshing={loading}
        onRefresh={()=>getPetList(category)}
       contentContainerStyle="p-2"
        columnWrapperStyle="justify-between"
        
        style={{ width: Dimensions.get("window").width }}
      />
    </View>
  );
};

export default PetListCategory;
