import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ListRenderItem,
  FlatList,
  Image,
  Keyboard,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useConvex, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
const ChatId = () => {
  const { chatid } = useLocalSearchParams();
  const listRef = useRef<FlatList>(null);

  const [user, setUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
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
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true});
    }, 100);
  }, [messages]);
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
    try {
      Keyboard.dismiss();
      await addMessage({
        content: newMessage,
        group_id: chatid as Id<"groups">,
        user: user || "Anonymous",
      });
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const renderMessage: ListRenderItem<Doc<"messages">> = ({ item }) => {
    const isUser = item.user === user;

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.otherMessageContainer]}>
        {item.content !== "" && (<Text style={[styles.messageText, isUser ? styles.userMessageText : {}]}>{item.content}</Text>)}
        <Text style={styles.timestamp}>{new Date(item._creationTime).toLocaleTimeString()} - {item.user}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList ref={listRef}
        ListFooterComponent={<View style={{height: 20}}></View>}
        data={messages} renderItem={renderMessage} keyExtractor={(item)=>item._id.toString()}/>

        <View style={styles.inputContainer}>
        {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, margin: 10 }} />}

          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message"
              multiline={true}
            />
                      <TouchableOpacity style={styles.sendButton} >
              <Ionicons name="add-outline" style={styles.sendButtonText}></Ionicons>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleMessages}
              disabled={newMessage === ""}
            >
              <Ionicons
                name="send-outline"
                style={styles.sendButtonText}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EA",
  },
  inputContainer: {
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    elevation: 3,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 40,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  sendButton: {
    backgroundColor: "#EEA217",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    alignSelf: "flex-end",
  },
  sendButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
    maxWidth: "80%",
  },
  userMessageContainer: {
    backgroundColor: "#791363",
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 16,
    flexWrap: "wrap",
  },
  userMessageText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 12,
    color: "#c7c7c7",
  },
});
export default ChatId;
