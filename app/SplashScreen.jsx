import React from 'react';
import { View, Image, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const SplashScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white relative">
      <StatusBar style="dark" />
      
      <div className="absolute w-[30rem] h-[30rem] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full filter blur-3xl opacity-50 animate-spin"></div>
      
      <Image
        source={require('../assets/images/tailmates-splash.jpg')} // Update with your actual image path
        className="w-48 h-48 mb-8"
      />
      
      <Text className="text-2xl font-bold text-gray-800 text-center px-6">
        Welcome to Tailmates! 🐾{'\n'}
        Hang tight! We're just giving your pets some extra treats while we set things up.{'\n'}
        Prepare for a tail-wagging good time!
      </Text>
    </View>
  );
};

export default SplashScreen;
