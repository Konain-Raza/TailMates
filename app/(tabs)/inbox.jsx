import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Ensure correct import
import UserItem from "../../components/Inbox/UserItem";

const Inbox = () => {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [mappedUsers, setMappedUsers] = useState([]);

  useEffect(() => {
    if (user) {
      getUserList();
    } else {
      console.log("User is not defined or logged in.");
    }
  }, [user]);

  useEffect(() => {
    if (userList.length > 0) {
      mapOthers();
    }
  }, [userList]);

  const mapOthers = () => {
    const lists = [];
    userList.forEach((record) => {
      const otherUser = record.users?.filter(
        (u) => u?.email !== user?.primaryEmailAddress?.emailAddress
      );
      if (otherUser.length > 0) {
        const result = {
          docId: record.id,
          ...otherUser[0],
        };
        lists.push(result);
      }
    });
    setMappedUsers(lists); // Update the state with the processed users
  };

  const getUserList = async () => {
    setUserList([]);
    try {
      console.log('Fetching user list for:', user?.primaryEmailAddress?.emailAddress);

      const q = query(
        collection(db, "chats"),
        where("userIds", "array-contains", user?.primaryEmailAddress?.emailAddress)
      );

      const snapshot = await getDocs(q);
      const userListData = snapshot.docs.map((doc) => doc.data());
      console.log('User list data:', userListData);
      setUserList(userListData);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  return (
    <View>
      <Text className='font-outfit-bold'>Inbox</Text>
      <FlatList
        data={mappedUsers} // Use the state that contains the processed users
        renderItem={({ item }) => (
          <UserItem userinfo={item} />
        )}
        keyExtractor={(item) => item.docId} // Ensure a unique key for each item
      />
    </View>
  );
};

export default Inbox;
