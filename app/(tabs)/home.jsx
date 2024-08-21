import { View, Text } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListCategory from "../../components/Home/PetListCategory";
const Home = () => {
  return (
    <View className="w-full h-full mt-5 px-3">
      <Header />
      <Slider/>
      <PetListCategory/>
    </View>
  );
};

export default Home;
