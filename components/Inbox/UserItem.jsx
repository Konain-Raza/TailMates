import { View, Text, Image } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const UserItem = ({ userinfo }) => {
  return (
<Link href={'Chat?id='+userinfo?.docId}>
<View className="flex-row items-center p-2 bg-gray-100 mb-2 rounded-lg border ">
      <Image
        source={{ uri: userinfo?.imageURL || 'https://via.placeholder.com/50' }} // Use a default image if profile picture is missing
        className="w-12 h-12 rounded-full"
      />
      <Text className="ml-4 text-2xl  font-outfit-bold">{userinfo?.name}</Text>
    </View></Link>
  );
};

export default UserItem;
