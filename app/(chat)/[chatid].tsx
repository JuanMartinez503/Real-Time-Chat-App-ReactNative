import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useConvex, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
const ChatId = () => {
  const { chatid } = useLocalSearchParams();

  const [user, setUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const addMessage = useMutation(api.messages.sendMessage);
  const messages =
    useQuery(api.messages.get, { chatId: chatid as Id<"groups"> }) || [];

  const navigation = useNavigation();
  const convex = useConvex();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    };
    loadUser();
  }, []);
  useEffect(() => {
    const loadGroup = async () => {
      const group = await convex.query(api.groups.getGroup, {
        id: chatid as Id<"groups">,
      });
      navigation.setOptions({ headerTitle: group?.name });
      console.log(group);
    };
    loadGroup();
  }, []);
  const handleMessages = async () => {
    await addMessage({
      content: newMessage,
      group_id: chatid as Id<"groups">,
      user: user || "papi",
    });
  };
  return (
    <View>
      <Text>ChatId : {chatid}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChatId;
