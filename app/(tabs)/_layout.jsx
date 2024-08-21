import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <AntDesign name="hearto" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Home",
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
