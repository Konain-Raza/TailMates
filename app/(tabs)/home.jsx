import { ScrollView,View ,Text } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListCategory from "../../components/Home/PetListCategory";
const Home = () => {
  return (
    <ScrollView className="w-full h-max mt-5 px-3">
      <Header />
      <Slider/>
      <PetListCategory/>
    </ScrollView>
  );
};

export default Home;
