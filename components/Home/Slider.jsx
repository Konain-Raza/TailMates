import { View, FlatList, Image, Dimensions } from "react-native";
import { getDocs, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../app/firebase-config";

const Slider = () => {
  const [sliders, setSliders] = useState([]);
   const[loading, setLoading] = useState(false)

  useEffect(() => {
    getSliders();
  }, []);

  const getSliders = async () => {
    setLoading(true);
    setSliders([]);
    const snapshot = await getDocs(collection(db, "sliders"));
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        setSliders(sliders=>[...sliders, doc.data()]);

      }
    });
    setLoading(false)
  };

  return (
    <View className="w-[95%] mx-auto h-[23vh] flex  items-center justify-center ">
      <FlatList 
        data={sliders}
        refreshing={loading}
        onRefresh={()=>{
          getSliders();
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item,index }) => (
          <View className="p-1 mr-3">
            <Image source={{ uri: item.imageURL  }} className=" h-full object-cover rounded-xl" style={{width:Dimensions.get('screen').width*0.9}}/>
          </View>
        )}
      />
    </View>
  );
};

export default Slider;
