import { View, Text, Image, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  setDoc,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const PetDetails = () => {
  const pet = useLocalSearchParams();
  const [readmore, setReadmore] = useState(false);
  const navigation = useNavigation();
  const [isFilled, setIsFilled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const handleFieldClick = async () => {
    if (!user || isUpdating) return;

    setIsUpdating(true);

    try {
      const email = user.primaryEmailAddress.emailAddress;
      const petId = pet.id;

      if (!petId) {
        console.error("Pet ID is undefined");
        return;
      }

      const docRef = doc(db, "favourites", email);
      const docSnap = await getDoc(docRef);

      let currentFavourites = [];
      if (docSnap.exists()) {
        currentFavourites = docSnap.data().favourites || [];
      } else {
        await setDoc(docRef, { favourites: [] });
      }

      const isAlreadyFavorited = currentFavourites.includes(petId);

      if (isAlreadyFavorited) {
        setIsFilled(false);
        currentFavourites = currentFavourites.filter((id) => id !== petId);
      } else {
        setIsFilled(true);
        currentFavourites.push(petId);
      }

      if (isAlreadyFavorited) {
        await updateDoc(docRef, { favourites: arrayRemove(petId) });
      } else {
        await updateDoc(docRef, { favourites: arrayUnion(petId) });
      }
    } catch (error) {
      console.error("Error updating favourites:", error);
      setIsFilled(!isFilled);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!user) return;

      const email = user.primaryEmailAddress.emailAddress;
      const petId = pet.id;

      if (!petId) return;

      const docRef = doc(db, "favourites", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentFavourites = docSnap.data().favourites || [];
        if (currentFavourites.includes(petId)) {
          setIsFilled(true);
        }
      }
    };

    checkIfFavorited();

    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation, user, pet.id]);

  const InitiateChat = async () => {

    const docID1 = user.primaryEmailAddress.emailAddress + "_" +pet?.owneremail;
    const docID2 = pet.email + "_" + user.primaryEmailAddress.emailAddress;
  
    const q = query(
      collection(db, "chats"),
      where("id", "in", [docID1, docID2])
    );

    router.push({
      pathname: "/Chat",
      query: { id: docID1 }, // Use `query` to pass URL parameters
    });
    
    // Check if necessary properties are defined
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.error("User email or pet email/owneremail is undefined");
      return;
    }
  
  
    try {
      const querysnapshot = await getDocs(q);
      let chatExists = false;
  
      querysnapshot.forEach((doc) => {
        // console.log("Existing chat:", doc.data());
        chatExists = true;
      });
  
      if (!chatExists) {
        // Check for undefined values and provide fallback values if necessary
        const chatData = {
          id: docID1,
          users: [
            {
              email: user.primaryEmailAddress.emailAddress || "unknown@domain.com",
              name: user.fullName || "User",
              imageURL: user.imageUrl || "", // Provide a default empty string if imageUrl is undefined
            },
            {
              email: pet.owneremail || "unknown@domain.com",
              name: pet.ownername || "Owner",
              imageURL: pet.image || "", // Provide a default empty string if image is undefined
            },
          ],
        };
  
        await setDoc(doc(db, "chats", docID1), chatData);
  
        router.push({
          pathname: "/Chat",
          query: { id: docID1 }, // Use `query` to pass URL parameters
        });
        
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
    }
  };
  
  
  return (
    <ScrollView className="flex-1 bg-[#D4BAF8]">
      <Image
        source={{ uri: pet.imageURL }}
        className="w-full h-[50vh] object-cover"
      />

      <View className="relative bg-white p-6 rounded-t-3xl mt-[-20px] ">
        <View className="flex justify-between flex-row items-center mb-4  b px-2">
          <View className="w-max h-max">
            <Text className="font-outfit-bold text-3xl text-black ">
              {pet.name}
            </Text>
            <Text className="text-lg font-outfit-medium text-gray-600 ">
              {pet.breed}
            </Text>
          </View>
          <View className=" flex justify-center items-center">
            <FontAwesome
              onPress={handleFieldClick}
              name={isFilled ? "heart" : "heart-o"} // Toggle heart icon
              size={33}
              color={isFilled ? "red" : "black"}
            />
          </View>
        </View>
        <View className="flex-row flex-wrap justify-between mb-4">
          {/* Box 1 */}
          <View className="flex-row items-center p-4 bg-purple-200 rounded-2xl shadow-md mb-2 w-[42%] h-24 max-w-xs">
            <FontAwesome name="calendar" size={30} color="black" />
            <View className="ml-3 flex-1">
              <Text className="text-lg font-outfit-bold text-black">Age</Text>
              <Text className="text-gray-600 text-sm font-outfit">
                {pet.age}
              </Text>
            </View>
          </View>

          {/* Box 2 */}
          <View className="flex-row items-center p-4 bg-purple-200 rounded-2xl shadow-md mb-2 w-[55%] h-24 max-w-xs">
            <FontAwesome name="paw" size={30} color="black" />
            <View className="ml-3 ">
              <Text className="text-lg font-outfit-bold text-black">Breed</Text>
              <Text className="text-gray-600 text-sm font-outfit">
                {pet.breed}
              </Text>
            </View>
          </View>

          {/* Box 3 */}
          <View className="flex-row items-center p-4 bg-purple-200 rounded-2xl shadow-md mb-2 w-[42%] h-24 max-w-xs">
            <FontAwesome name="venus-mars" size={30} color="black" />
            <View className="ml-3 flex-1">
              <Text className="text-lg font-outfit-bold text-black">
                Gender
              </Text>
              <Text className="text-gray-600 text-sm font-outfit">
                {pet.gender}
              </Text>
            </View>
          </View>

          {/* Box 4 */}
          <View className="flex-row items-center p-4 bg-purple-200 rounded-2xl shadow-md mb-2 w-[55%] h-24 max-w-xs">
            <FontAwesome name="balance-scale" size={30} color="black" />
            <View className="ml-3 flex-1">
              <Text className="text-lg font-outfit-bold text-black">
                Weight
              </Text>
              <Text className="text-gray-600 text-sm font-outfit">
                {pet.weight}
              </Text>
            </View>
          </View>
        </View>

        <View className="w-full mb-4">
          <Text className="text-2xl font-outfit-bold text-black mb-2">
            About
          </Text>
          <Text
            className="text-gray-700 text-base mb-2"
            numberOfLines={readmore ? undefined : 3} // Show all lines if readmore is true, 3 lines if false
          >
            {pet.about}
          </Text>
          <Pressable
            onPress={() => {
              setReadmore(!readmore);
            }}
          >
            <Text className="text-blue-600 font-semibold">
              {readmore ? "Read Less" : "Read More"}
            </Text>
          </Pressable>

          <View className="bg-purple-200 p-4 rounded-2xl shadow-2xl mt-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: pet.imageURL }}
                className="w-16 h-16 rounded-full border-2 border-gray-300"
              />
              <View className="ml-4 flex-1">
                <Text className="text-2xl font-bold text-black">
                  {pet.name}
                </Text>
                <Text className="text-gray-600 text-md font-outfit-medium">
                  Pet Owner
                </Text>
              </View>
              <Pressable
                className="py-2 px-4 rounded-lg"
                onPress={() => {
                  console.log("jsn");
                }}
              >
                <Ionicons name="chatbox" size={35} color="purple" />
              </Pressable>
            </View>
          </View>
        </View>
        <Pressable
          className="w-full text-center p-5 bg-purple-950 mx-auto flex items-center rounded-xl"
          onPress={() => InitiateChat()}
        >
          <Text className="text-white text-xl font-bold">Adopt Me</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default PetDetails;
