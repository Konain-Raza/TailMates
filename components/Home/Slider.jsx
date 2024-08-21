import { View, FlatList, Image, Dimensions } from "react-native";
import { getDocs, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../app/firebase-config";

const Slider = () => {
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    getSliders();
  }, []);

  const getSliders = async () => {
    setSliders([]);
    const snapshot = await getDocs(collection(db, "sliders"));
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        setSliders(sliders=>[...sliders, doc.data()]);

      }
    });
  };

  return (
    <View className="w-max h-[30%] flex items-center justify-center ">
      <FlatList 
        data={sliders}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item,index }) => (
          <View className="p-1 mr-3">
            <Image source={{ uri: item?.imageURL }} className=" h-full rounded-xl" style={{width:Dimensions.get('screen').width*0.9}}/>
          </View>
        )}
      />
    </View>
  );
};

export default Slider;
