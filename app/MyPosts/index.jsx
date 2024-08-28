import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import { useNavigation } from "expo-router";
import { db } from "../firebase-config";
import { collection, query, where, getDocs, deleteDoc, doc,updateDoc, arrayRemove } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import PetCard from "../../components/Home/PetCard";

const MyPost = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [userPets, setUserPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserPets = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    setLoading(true);

    try {
      const q = query(
        collection(db, "pets"),
        where("owneremail", "==", user?.primaryEmailAddress?.emailAddress)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setUserPets([]);
        return;
      }

      const pets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserPets(pets);
    } catch (error) {
      Alert.alert(
        "Error fetching user pets:",
        error.message || error.toString()
      );
     
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "My Pets",
    });

    if (user) {
      getUserPets();
    }
  }, [user, navigation, getUserPets]);

  const deletePet = async (id) => {
    Alert.alert(
      "Do you want to delete?",
      "Do you really want to delete this pet?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
           
            try {
              const userFavDocRef = doc(db, "favourites", user?.primaryEmailAddress?.emailAddress);
              await deleteDoc(doc(db, "pets", id));
              await updateDoc(userFavDocRef, {
                favorites: arrayRemove(id),
              });
              getUserPets();
            } catch (error) {
              Alert.alert(
                "Error deleting pet:",
                error.message || error.toString()
              );
         
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text className='font-outfit-bold text-3xl my-7'>
        My Pets 🎉✨
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#954FEF" />
      ) : (
        <FlatList
          data={userPets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="w-[48%] flex-col  mb-2">
            <PetCard item={item} className='w-full'/>
            <Pressable
              className="bg-red-500 p-2 rounded-lg mt-2 flex items-center justify-center"
              onPress={() => deletePet(item.id)}
            >
              <Text className="text-white text-center font-outfit-bold">
                🗑️ Delete
              </Text>
            </Pressable>
          </View>
          )}
          numColumns={2}
          refreshing={loading}
          onRefresh={getUserPets}
          contentContainerStyle={{ padding: 8 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      )}
    </View>
  );
};

export default MyPost;
