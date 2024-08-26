import { ScrollView, View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import PetCard from "../../components/Home/PetCard";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useUser } from "@clerk/clerk-expo";

const Favourites = () => {
  const [favData, setFavData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const getFavourites = async () => {
    if (!user) {
      console.log("User not logged in");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const email = user.primaryEmailAddress.emailAddress; // Use actual user email
      const favDocRef = doc(db, "favourites", email);
      const favDocSnap = await getDoc(favDocRef);

      if (!favDocSnap.exists()) {
        console.log("No favourites document found.");
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
              console.log(`Pet with ID ${petId} does not exist.`);
            }
          }
          setFavData(pets);
        }
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavourites();
  }, [user]); 

  return (
    <View className="w-full px-3">
      <View className="mt-10 w-full h-max">
        <Text className="text-3xl font-outfit-bold px-2">Favourites ✨</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#954FEF" />
      ) : (
        <FlatList
          className="w-full"
          data={favData}
          renderItem={({ item }) => <PetCard item={item}  />}
          numColumns={2}
          refreshing={loading}
          onRefresh={getFavourites} 
          contentContainerStyle={{ padding: 8 }}
          columnWrapperStyle={{ justifyContent: "space-around" }}
        />
      )}
    </View>
  );
};

export default Favourites;
