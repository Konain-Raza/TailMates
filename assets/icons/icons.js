// assets/icons/icons.js
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';

export const icons = {
  home: ({ color }) => <Feather name="home" size={24} color={color} />,
  favourites: ({ color }) => <AntDesign name="hearto" size={24} color={color} />,
  inbox: ({ color }) => <Ionicons name="chatbubble-outline" size={24} color={color} />,
  profile: ({ color }) => <Feather name="user" size={24} color={color} />,
};
