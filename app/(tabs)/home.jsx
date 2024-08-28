import { Text } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListCategory from "../../components/Home/PetListCategory";
import { SafeAreaView } from "react-native-safe-area-context";
const Home = () => {
  return (
    <SafeAreaView className=" p-2 flex-1">
      <Header />
      <Slider/>
      <PetListCategory/>
    </SafeAreaView>
  );
};

export default Home;
