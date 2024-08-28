import { View, Text, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

const UserItem = ({ userinfo }) => {
  return (
    <Link
      href={"Chat?id=" + userinfo?.docId}
      className="w-[95%] m-auto bg-white p-4 mb-3  rounded-2xl "
    >
      <View className="flex-row items-center p-2 bg-white  mb-2 rounded-lg ">
        <Image
          source={{
            uri: userinfo.imageURL,
          }}
          className="w-12 h-12 rounded-full"
        />
        <Text className="ml-4 text-2xl  font-outfit-bold">
          {userinfo?.name}
        </Text>
      </View>
    </Link>
  );
};

export default UserItem;
