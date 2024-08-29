import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { storage, db } from "../firebase-config";
import { useUser } from "@clerk/clerk-expo";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { setDoc, collection, doc } from "firebase/firestore";

const Index = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  const [form, setForm] = useState({
    name: "",
    category: "",
    gender: "",
    age: "",
    breed: "",
    about: "",
    weight: "",
    imageURL: null,
    ownername: "",
    owneremail: "",
  });

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([
    { label: "Birds", value: "🐥 Birds" },
    { label: "Cats", value: "🐱 Cats" },
    { label: "Dogs", value: "🐶 Dogs" },
    { label: "Ferrets", value: "🦊 Ferrets" },
    { label: "Fish", value: "🐠 Fish" },
    { label: "Hedgehogs", value: "🦔 Hedgehogs" },
    { label: "Hamsters", value: "🐹 Hamsters" },
    { label: "Parrots", value: "🦜 Parrots" },
    { label: "Rabbits", value: "🐰 Rabbits" },
    { label: "Turtles", value: "🐢 Turtles" },
  ]);

  const [genders, setGenders] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Enroll Your Furry Companion 🐕",
    });
  }, [navigation]);

  useEffect(() => {
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        ownerimg: user?.imageUrl,
        ownername: user.fullName || "No name available",
        owneremail:
          user.primaryEmailAddress?.emailAddress || "No email available",
      }));
    }
  }, [user]);

  const handleChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setForm((prevForm) => ({
        ...prevForm,
        imageURL: result.assets[0].uri,
      }));
    }
  };

  const uploadImage = async () => {
    if (!form.imageURL) {
      Alert.alert("No image URI provided");
      return null;
    }

    try {
      const response = await fetch(form.imageURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }

      const blobImg = await response.blob();
      const mimeType = blobImg.type;

      const storageRef = ref(storage, `/Images/${Date.now()}`);
      await uploadBytes(storageRef, blobImg, { contentType: mimeType });

      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      Alert.alert("Error uploading image:", error.message || error.toString());
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setForm((prevForm) => ({
      ...prevForm,
      ownerimg: user?.imageUrl,
      ownername: user.fullName || "No name available",
      owneremail:
        user.primaryEmailAddress?.emailAddress || "No email available",
    }));
    const emptyFields = Object.keys(form).filter(
      (key) => !form[key] && form[key] !== 0
    );

    if (emptyFields.length > 0) {
      const missingFields = emptyFields
        .map((field) => {
          switch (field) {
            case "name":
              return "Name";
            case "category":
              return "Category";
            case "gender":
              return "Gender";
            case "age":
              return "Age";
            case "breed":
              return "Breed";
            case "about":
              return "About";
            case "weight":
              return "Weight";
            case "image":
              return "Image";
            default:
              return field.charAt(0).toUpperCase() + field.slice(1);
          }
        })
        .join(", ");

      Alert.alert(
        "Error",
        `Please fill in the following fields: ${missingFields}`
      );
      setLoading(false);
      return;
    }

    try {
      let imageUrl = form.imageURL;
      if (form.imageURL) {
        imageUrl = await uploadImage();
        if (imageUrl) {
          setForm((prevForm) => ({
            ...prevForm,
            imageURL: imageUrl,
          }));
        } else {
          Alert.alert("Error", "Image upload failed. Please try again.");
          setLoading(false);
          return;
        }
      }

      const docRef = doc(collection(db, "pets"));

      await setDoc(docRef, {
        ...form,
        imageURL: imageUrl,
        id: docRef.id,
      });

      Alert.alert("Success", "Pet added successfully!");

      setForm({
        name: "",
        category: "",
        gender: "",
        age: "",
        breed: "",
        about: "",
        weight: "",
        imageURL: null,
      });
    } catch (error) {
      Alert.alert("Error adding document:", error.message || error.toString());
      Alert.alert("Error", "An error occurred while adding the pet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-8 bg-white">
      <Text className="text-black text-2xl font-bold mb-6">
        Register Your New Furry Friend 🦴🐕
      </Text>

      <TouchableOpacity
        onPress={handleImagePick}
        className="w-40 aspect-square bg-gray-200 border border-gray-400 justify-center items-center rounded-lg mb-6"
      >
        {form.imageURL ? (
          <Image
            source={{ uri: form.imageURL }}
            className="w-full h-full rounded-lg"
          />
        ) : (
          <Text className="text-gray-500">Select an image</Text>
        )}
      </TouchableOpacity>

      <View className="w-full mb-4">
        <Text className="font-bold text-lg mb-2">Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />

        <Text className="font-bold text-lg mb-2">Breed</Text>
        <TextInput
          maxLength={20}
          className="border border-gray-300 rounded-lg p-3 mb-4"
          value={form.breed}
          onChangeText={(text) => handleChange("breed", text)}
        />

        <View className="flex-row justify-between mb-4">
          <View className="w-1/2 pr-2">
            <Text className="font-bold text-lg mb-2">Age</Text>
            <TextInput
              maxLength={2}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg p-3"
              value={form.age}
              onChangeText={(text) => handleChange("age", text)}
            />
          </View>
          <View className="w-1/2 pl-2">
            <Text className="font-bold text-lg mb-2">Weight (kg)</Text>
            <TextInput
              maxLength={3}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg p-3"
              value={form.weight}
              onChangeText={(text) => handleChange("weight", text)}
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="font-bold text-lg mb-2">Category</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 8,
              padding: 3,
            }}
          >
            <Picker
              selectedValue={form.category}
              onValueChange={(itemValue) => handleChange("category", itemValue)}
              style={{ padding: 10 }}
            >
              <Picker.Item label="Select category" value="" />
              {categories.map((category, index) => (
                <Picker.Item
                  key={index}
                  label={category.label}
                  value={category.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-4">
          <Text className="font-bold text-lg mb-2">Gender</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 8,
              padding: 3,
            }}
          >
            <Picker
              selectedValue={form.gender}
              onValueChange={(itemValue) => handleChange("gender", itemValue)}
              className="border border-gray-300 rounded-lg"
            >
              <Picker.Item label="Select gender" value="" />
              {genders.map((gender, index) => (
                <Picker.Item
                  key={index}
                  label={gender.label}
                  value={gender.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <Text className="font-bold text-lg mb-2">About</Text>
        <TextInput
          multiline
          className="border border-gray-300 rounded-lg p-3 "
          value={form.about}
          onChangeText={(text) => handleChange("about", text)}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-purple-950 p-5 w-full my-5 mb-10 rounded-2xl items-center"
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? "Fetching treats..." : "Add Your Furry Friend 🐕"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Index;
