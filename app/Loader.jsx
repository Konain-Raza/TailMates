import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

export default function Loader() {
  // Create animation values
  const hamsterAnim = useRef(new Animated.Value(0)).current;
  const wheelAnim = useRef(new Animated.Value(0)).current;

  // Set up the animations
  useEffect(() => {
    // Hamster animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(hamsterAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(hamsterAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wheel animation
    Animated.loop(
      Animated.timing(wheelAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [hamsterAnim, wheelAnim]);

  // Dynamic styles for hamster animation
  const hamsterStyle = {
    transform: [
      {
        rotate: hamsterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '4deg'],
        }),
      },
      {
        translateX: hamsterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-12, -12], // Adjust as needed
        }),
      },
      {
        translateY: hamsterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 24], // Adjust as needed
        }),
      },
    ],
  };

  return (
    <View className="relative w-48 h-48">
      {/* Wheel */}
      <Animated.View 
        className="absolute rounded-full bg-gray-600" 
        style={{
          width: '100%',
          height: '100%',
          transform: [{ rotate: wheelAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
        }}
      />

      {/* Hamster */}
      <View className="absolute top-1/2 left-1/2 w-28 h-14 -translate-x-14 -translate-y-7 rotate-4">
        <Animated.View
          className="absolute rounded-full bg-yellow-400"
          style={[hamsterStyle, { width: 56, height: 28 }]}
        />

        <View className="absolute top-0 left-1/2 w-3 h-3 bg-pink-400 rounded-full -translate-x-1.5" />
        <View className="absolute top-1/4 left-1/2 w-2 h-2 bg-black rounded-full -translate-x-2" />
        <View className="absolute top-3 left-1/2 w-1.5 h-1.5 bg-pink-300 rounded-full -translate-x-3" />
        <View className="absolute top-2 left-3 w-3 h-1.5 bg-yellow-300 rounded-full" />
        <View className="absolute top-0.5 left-0.5 w-1.5 h-1 bg-yellow-300 rounded-full" />
        <View className="absolute top-4 left-4 w-2 h-2 bg-yellow-200 rounded-full" />
        <View className="absolute top-5 left-1.5 w-1 h-1 bg-pink-100 rounded-full" />
      </View>
    </View>
  );
}
