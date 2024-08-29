import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const UserItem = ({ userinfo }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (userinfo?.docId) {
      navigation.navigate("Chat", { id: userinfo.docId });
    } else {
      console.error("User ID is missing.");
      Alert.alert("Error", "User ID is missing.");
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        width: "95%",
        margin: "auto",
        backgroundColor: "white",
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
          backgroundColor: "white",
          marginBottom: 8,
          borderRadius: 8,
        }}
      >
        <Image
          source={{ uri: userinfo?.imageURL }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <Text style={{ marginLeft: 16, fontSize: 24, fontWeight: "bold" }}>
          {userinfo?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;
