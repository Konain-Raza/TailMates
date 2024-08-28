import React from "react";
import { TouchableOpacity, Animated } from "react-native";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

const TabLayout = () => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;
  const horizontalTranslate = React.useRef(new Animated.Value(0)).current;

  const handlePress = (onPress) => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(animatedValue, {
          toValue: 1.2,
          friction: 2,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.spring(horizontalTranslate, {
          toValue: 10,
          friction: 2,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(animatedValue, {
          toValue: 1,
          friction: 2,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.spring(horizontalTranslate, {
          toValue: 0,
          friction: 2,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    onPress();
  };

  const tabBarIconStyle = (color) => ({
    transform: [
      { scale: animatedValue },
      { translateX: horizontalTranslate },
    ],
    marginBottom: 0,
  });

  const tabBarLabelStyle = ({ focused }) => ({
    color: focused ? 'transparent' : '#9ca3af',
    fontWeight: '600',
    fontSize: focused ? 16 : 14,
    marginTop: 0,
  });

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          width: '85%',
          alignSelf: 'center',
          backgroundColor: 'white',
          borderRadius: 15,
          marginBottom: 10,
          paddingVertical: 1,
          height: 65,
          marginHorizontal: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: tabBarLabelStyle,
        tabBarIconStyle: tabBarIconStyle,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarActiveBackgroundColor: '#6d28d9',
        tabBarItemStyle: {
          borderRadius: 10,
          display: "flex",
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 10,
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            onPress={() => handlePress(props.onPress)}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="hearto" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
