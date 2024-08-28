import {
  ScrollView,
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import PetCard from "../../components/Home/PetCard";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useUser } from "@clerk/clerk-expo";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const Favourites = () => {

  const [favData, setFavData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const getFavourites = async () => {
    if (!user) {
      Alert.alert("Error", "User not logged in");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const email = user.primaryEmailAddress.emailAddress;
      const favDocRef = doc(db, "favourites", email);
      const favDocSnap = await getDoc(favDocRef);

      if (!favDocSnap.exists()) {
  
        
        setFavData([]);
      } else {
        const favIds = favDocSnap.data().favourites || [];
        if (favIds.length === 0) {
          setFavData([]);
        } else {
          const pets = [];
          for (const petId of favIds) {
            const petDocRef = doc(db, "pets", petId);
            const petDocSnap = await getDoc(petDocRef);

            if (petDocSnap.exists()) {
              pets.push({ id: petDocSnap.id, ...petDocSnap.data() });
            } else {
              Alert.alert(
                "Error",
                `Pet with ID does not exist.`
              );
              
            }
          }
          setFavData(pets);
        }
      }
    } catch (error) {
      Alert.alert(
        "Error fetching favourites:",
        error.message || error.toString()
      );
      
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getFavourites();
    }, [user])
  );

  return (
    <View className="w-full p-3 pt-3">
      <View className="mt-10 w-full h-max mb-5">
        <Text className="text-3xl font-outfit-bold px-2">Favourites ✨</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#954FEF" />
      ) : favData.length === 0 ? (
        <View className='w-full min-h-[80%] max-h-max p-10 flex items-center justify-center'>
          <Text className="text-xl font-outfit-bold text-gray-800 mt-4 text-center">
            No favorites yet! 🐾 Your heart is still open for the perfect pet!
            💖
          </Text>
          <Image source={require("../../assets/images/nofavs.png")} className='contain w-56 h-56' />
        </View>
      ) : (
        <FlatList
          className="w-full"
          data={favData}
          renderItem={({ item }) => (
            <View className="w-[45%] mr-10">
              <PetCard item={item} />
            </View>
          )}
          numColumns={2}
          refreshing={loading}
          onRefresh={getFavourites}
          contentContainerStyle={{ padding: 8 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      )}
    </View>
  );
};

export default Favourites;
