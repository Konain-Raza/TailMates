import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { addDoc, collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import moment from "moment";

const Chat = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);

  const getUserDetails = useCallback(async () => {
    if (!params?.id || !user?.primaryEmailAddress?.emailAddress) return;

    const docRef = doc(db, "chats", params.id);

    try {
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      if (!data?.users) return;
      const filteredUser = data.users.filter(
        (item) => item.email !== user.primaryEmailAddress.emailAddress
      );

      if (filteredUser.length > 0) {
        navigation.setOptions({
          headerTitle: filteredUser[0]?.name || "User",
        });
        setOtherUser(filteredUser[0]);
      }
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  }, [params?.id, user?.primaryEmailAddress?.emailAddress, navigation]);

  useEffect(() => {
    if (!params?.id) return;

    getUserDetails();

    const unsubscribe = onSnapshot(
      collection(db, "chats", params.id, "messages"),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      }
    );

    return () => unsubscribe();
  }, [params.id, getUserDetails]);

  const onSend = useCallback(async (newMessages = []) => {
    if (newMessages.length > 0 && params?.id) {
      const message = {
        ...newMessages[0],
        createdAt: moment().toISOString(), // Ensure correct format
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );
      await addDoc(collection(db, "chats", params.id, "messages"), message);
    }
  }, [params?.id]);

  if (!user) {
    return null; // or a loading indicator if user is not loaded yet
  }

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        showUserAvatar
        onSend={onSend}
        user={{
          _id: user?.primaryEmailAddress?.emailAddress || "",
          name: user?.fullName || "Unknown User",
          avatar: user?.imageUrl || "",
        }}
      />
    </View>
  );
};

export default Chat;
