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
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { storage, db } from "../firebase-config";
import { useUser } from "@clerk/clerk-expo";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { setDoc, collection, doc } from "firebase/firestore";

const Index = () => {
  const navigation = useNavigation();
  const { user } = useUser(); // Destructure user from the hook

  const [form, setForm] = useState({
    name: "",
    category: "",
    gender: "",
    age: "",
    breed: "",
    about: "",
    weight: "",
    imageURL: null,
    
    owner: "",
    owneremail: "",
  });
  const [openCategory, setOpenCategory] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [valueCategory, setValueCategory] = useState("");
  const [valueGender, setValueGender] = useState("");
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
      headerTitle: "Add New Pet",
    });
  }, [navigation]);

  useEffect(() => {
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        owner: user.fullName || "No name available",
        owneremail: user.primaryEmailAddress?.emailAddress || "No email available",
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
      console.error("No image URI provided");
      return;
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
      setForm((prevForm) => ({
        ...prevForm,
        imageURL: url,
      }));
  
      console.log("Image upload successful:", url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const emptyFields = Object.keys(form).filter(
      (key) => !form[key] && form[key] !== 0
    );

    if (emptyFields.length > 0) {
      const missingFields = emptyFields
        .map((field) => {
          switch (field) {
            case 'name': return 'Name';
            case 'category': return 'Category';
            case 'gender': return 'Gender';
            case 'age': return 'Age';
            case 'breed': return 'Breed';
            case 'about': return 'About';
            case 'weight': return 'Weight';
            case 'image': return 'Image';
            default: return field.charAt(0).toUpperCase() + field.slice(1);
          }
        })
        .join(', ');

      Alert.alert(
        'Error',
        `Please fill in the following fields: ${missingFields}`
      );

      setLoading(false);
      return;
    }

    try {
      if (form.imageURL) {
        await uploadImage();
      }

      const docRef = doc(collection(db, 'pets'));

      await setDoc(docRef, {
        ...form,
        id: docRef.id,
      });

      Alert.alert('Success', 'Pet added successfully!');

      setForm({
        name: '',
        category: '',
        gender: '',
        age: '',
        breed: '',
        about: '',
        weight: '',
        imageURL: null,
      });
      setValueCategory('');
      setValueGender('');

    } catch (error) {
      console.error('Error adding document:', error);
      Alert.alert('Error', 'An error occurred while adding the pet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          color: "#000",
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 24,
        }}
      >
        Add New Pet
      </Text>

      <TouchableOpacity
        onPress={handleImagePick}
        style={{
          width: "40%",
          aspectRatio: 1, // Square aspect ratio
          backgroundColor: "#f0f0f0",
          borderColor: "#ccc",
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        {form.imageURL ? (
          <Image
            source={{ uri: form.imageURL }}
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
          />
        ) : (
          <Text style={{ color: "#888" }}>Select an image</Text>
        )}
      </TouchableOpacity>

      <View style={{ width: "100%", marginBottom: 16 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Name
        </Text>
        <TextInput
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />

        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Breed
        </Text>
        <TextInput
          maxLength={20}
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          value={form.breed}
          onChangeText={(text) => handleChange("breed", text)}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View style={{ width: "48%" }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
              Category
            </Text>
            <DropDownPicker
              open={openCategory}
              value={valueCategory}
              items={categories}
              setOpen={setOpenCategory}
              setValue={setValueCategory}
              onChangeValue={(value) => handleChange("category", value)}
              placeholder="Select a category"
              containerStyle={{ marginBottom: 16 }}
            />
          </View>
          <View style={{ width: "48%" }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
              Gender
            </Text>
            <DropDownPicker
              open={openGender}
              value={valueGender}
              items={genders}
              setOpen={setOpenGender}
              setValue={setValueGender}
              onChangeValue={(value) => handleChange("gender", value)}
              placeholder="Select gender"
              containerStyle={{ marginBottom: 16 }}
            />
          </View>
        </View>

        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Age
        </Text>
        <TextInput
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          keyboardType="numeric"
          value={form.age}
          onChangeText={(text) => handleChange("age", text)}
        />

        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Weight
        </Text>
        <TextInput
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          keyboardType="numeric"
          value={form.weight}
          onChangeText={(text) => handleChange("weight", text)}
        />

        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          About
        </Text>
        <TextInput
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            height: 100,
            textAlignVertical: "top",
            marginBottom: 16,
          }}
          multiline
          value={form.about}
          onChangeText={(text) => handleChange("about", text)}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: "#007bff",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
        }}
        disabled={loading}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          {loading ? "Adding..." : "Add Pet"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Index;
