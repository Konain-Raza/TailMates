import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import UserItem from "../../components/Inbox/UserItem";
import { Alert } from "react-native";

const Inbox = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (user) {
      getUserList();
    } else {
      Alert.alert("Error", "User is not defined or logged in.");
    }
  }, []);

  const getUserList = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "chats"),
        where(
          "userIds",
          "array-contains",
          user?.primaryEmailAddress?.emailAddress
        )
      );

      const snapshot = await getDocs(q);
      const userListData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserList(userListData);
    } catch (error) {
      Alert.alert(
        "Error fetching user list:",
        error.message || error.toString()
      );
    }
    setLoading(false);
  };

  const mapOthers = () => {
    return userList
      .map((record) => {
        const otherUser = record.users?.find(
          (u) => u?.email !== user?.primaryEmailAddress?.emailAddress
        );
        if (otherUser) {
          return {
            docId: record.id,
            ...otherUser,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  return (
    <View className="w-full px-5 pt-3">
      <View className="mt-10 w-full h-max mb-5">
        <Text className="text-3xl font-outfit-bold px-2">Inbox 📬</Text>
      </View>
      <FlatList
        refreshing={loading}
        onRefresh={getUserList}
        data={mapOthers()} // This returns the correct list
        renderItem={({ item }) => <UserItem userinfo={item} />}
        keyExtractor={(item) => item.docId}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center w-full h-[50vh] px-10">
            <Text className="text-lg text-center font-outfit-bold text-gray-800 mt-4">
              No messages here! 📭 Your inbox is empty.
            </Text>
            <Image source={require("../../assets/images/emptyinbox.png")} className='contain w-60 h-60' />
          </View>
        }
      />
    </View>
  );
};

export default Inbox;
