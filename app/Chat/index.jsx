import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const params = useLocalSearchParams();
  const [otherUser, setOtherUser] = useState(null);
  const navigation = useNavigation();

  const getUserDetails = async () => {
    if (!params?.id || !user?.primaryEmailAddress?.emailAddress) return;

    const docRef = doc(db, "chats", params.id);

    try {
      const snapshot = await getDoc(docRef);
      const data = snapshot.data();

      const filteredUser = data?.users.filter(
        (item) => item.email !== user.primaryEmailAddress.emailAddress
      );

      if (filteredUser.length > 0) {
        navigation.setOptions({
          headerTitle: filteredUser[0].name || "User",
        });
        setOtherUser(filteredUser[0]); // Set single user object
        console.log("Filtered user:", filteredUser[0]);
      }
    } catch (error) {
      console.log("Error fetching chat details:", error);
    }
  };

  useEffect(() => {
    getUserDetails();
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []); 

  const onSend = (newmessage) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newmessage)
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
};

export default Chat;
