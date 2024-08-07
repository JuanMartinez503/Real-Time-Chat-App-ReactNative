import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  ListRenderItem,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useConvex, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ImageModal from "@/components/ImageModal";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const Page = () => {
  const { chatid } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const addMessage = useMutation(api.messages.sendMessage);
  const messages =
    useQuery(api.messages.get, { chatId: chatid as Id<"groups"> }) || [];
  const [user, setUser] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const convex = useConvex();
  const navigation = useNavigation();

  // Load group name and set header title
  useEffect(() => {
    const loadGroup = async () => {
      const groupInfo = await convex.query(api.groups.getGroup, {
        id: chatid as Id<"groups">,
      });
      console.log(groupInfo);
      navigation.setOptions({ headerTitle: groupInfo!.name });
    };
    loadGroup();
  }, [chatid]);

  // Load user from async storage
  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem("user");
      setUser(user);
    };

    loadUser();
  }, []);

  // Scroll to bottom when new message is added
  useEffect(() => {
    setTimeout(() => {
      listRef.current!.scrollToEnd({ animated: true });
    }, 300);
  }, [messages]);

  // Send message to Convex
  // Optionally convert image from URI to blob and use special site endpoint
  const handleSendMessage = async () => {
    Keyboard.dismiss();

    if (selectedImage) {
      // Use SITE instead of URL in here!!!
      const url = `${process.env.EXPO_PUBLIC_CONVEX_SITE}/sendImage?user=${encodeURIComponent(user!)}&group_id=${chatid}&content=${encodeURIComponent(newMessage)}`;
      setUploading(true);

      // Convert URI to blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      // Send blob to Convex
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": blob!.type },
        body: blob,
      })
        .then(() => {
          setSelectedImage(null);
          setNewMessage("");
        })
        .catch((err) => console.log("ERROR: ", err))
        .finally(() => setUploading(false));
    } else {
      // Regular mutation to add a message
      await addMessage({
        group_id: chatid as Id<"groups">,
        content: newMessage,
        user: user || "Anonymous",
      });
      setNewMessage("");
    }
  };

  // Open image picker and set selected image
  const captureImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
    }
  };

  const uploadImage = async (mode: string) => {
    try {
      let result;
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,

          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }
      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      setModalVisible(false);
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };
  const saveImage = async (image: any) => {
    try {
      setSelectedImage(image);
      setModalVisible(false);
    } catch (error) {
      throw error;
    } finally {
      // setLoading(false);
    }
  };

  // Render a message
  // Use conditional styling and Convex data model
  const renderMessage: ListRenderItem<Doc<"messages">> = ({ item }) => {
    const isUserMessage = item.user === user;

    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        {item.content !== "" && (
          <Text
            style={[
              styles.messageText,
              isUserMessage ? styles.userMessageText : null,
            ]}
          >
            {item.content}
          </Text>
        )}
        {item.file && (
          <Image
            source={{ uri: item.file }}
            style={{ width: 200, height: 200, margin: 10 , borderRadius: 10, alignSelf:'center'}}
          />
        )}
        <Text style={[isUserMessage? {color:'#f5f5f5' , fontSize:9 , marginTop:5, fontFamily:'OpenSans'} : styles.timestamp]}>
          {new Date(item._creationTime).toLocaleTimeString()} - {item.user}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {/* Render the messages */}
        {messages.length === 0 && (<Text style={{textAlign:'center', marginTop:20, fontSize:20, fontFamily:'RobotoBold'}}>No messages found, try sending one!😀</Text>)}
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id.toString()}
          ListFooterComponent={<View style={{ padding: 10 }} />}
        />
        <ImageModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onCameraPress={() => uploadImage("camera")}
          onGalleryPress={() => uploadImage("gallery")}
        />

        {/* Bottom message input */}
        <View style={styles.inputContainer}>
          {selectedImage && (
            <View
              style={{
                width: 200,
                height: 200,
                margin: 10,
              }}
            >
              <Image
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "100%" }}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                  backgroundColor: "white",
                  borderRadius: 50,
                }}
                onPress={() => setSelectedImage(null)}
              >
                <Text>
                  <FontAwesome6 name="circle-xmark" size={24} color="black" />
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message"
              multiline={true}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons
                name="add-outline"
                size={350}
                style={styles.sendButtonText}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendButton, newMessage === "" && !selectedImage && { opacity: 0.5 }]}
              onPress={handleSendMessage}
              disabled={newMessage === "" && !selectedImage}
            >
              <Ionicons
                name="send-outline"
                style={styles.sendButtonText}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Cover screen while uploading image */}
      {uploading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5f5f5",
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
    backgroundColor: Colors.primary,
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
    backgroundColor: '#7790E8',
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 16,
    flexWrap: "wrap",
    fontFamily:"OpenSans"
  },
  userMessageText: {
    color: "#fff",
  },
  timestamp: {
    marginTop: 5,
    fontSize: 9,
    color: "grey",
    fontFamily:'OpenSans'
  },
});

export default Page;
