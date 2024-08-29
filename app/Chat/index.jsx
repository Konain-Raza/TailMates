import React, { useState, useEffect, useCallback } from "react";
import { View, Alert } from "react-native";
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
      Alert.alert("Error fetching chat details", JSON.stringify(error));
    }
  }, [params?.id, user?.primaryEmailAddress?.emailAddress, navigation]);

  useEffect(() => {
    if (!params?.id) return;
    getUserDetails();

    const unsubscribe = onSnapshot(
      collection(db, "chats", params.id, "messages"),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            _id: doc.id,
            text: data.text || '',
            createdAt: data.createdAt
              ? moment(data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt).toISOString()
              : moment().toISOString(),
            user: {
              _id: data.user?._id || '',
              name: data.user?.name || '',
              avatar: data.user?.avatar || '',
            },
          };
        });

        const sortedMessages = messagesData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setMessages(sortedMessages);
      }
    );

    return () => unsubscribe();
  }, [params.id, getUserDetails]);

  const onSend = useCallback(
    async (newMessages = []) => {
      if (newMessages.length > 0 && params?.id) {
        const message = {
          ...newMessages[0],
          createdAt: moment().toISOString(),
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessages)
        );
        try {
          await addDoc(collection(db, "chats", params.id, "messages"), message);
        } catch (error) {
          Alert.alert("Error sending message",  JSON.stringify(error));
        }
      }
    },
    [params?.id]
  );

  if (!user) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        showUserAvatar
        onSend={onSend}
        user={{
          _id: user?.primaryEmailAddress?.emailAddress || '',
          name: user?.fullName || '',
          avatar: user?.imageUrl || '',
        }}
      />
    </View>
  );
};

export default Chat;
