import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dialog from "react-native-dialog";

const index = () => {
  const groups = useQuery(api.groups.get) || [];
  const [name, setName] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem("user");
      console.log(user);
      if (!user) {
        setTimeout(() => {
          setVisible(true);
        }, 100);
      } else {
        setName(user);
      }
    };
    loadUser();
  }, []);

  const setUser = async () => {
    const r = (Math.random() + 1).toString(36).substring(7);
    const userName = `${name}#${r}`;
    await AsyncStorage.setItem("user", userName);
    setName(userName);
    setVisible(false);
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView style={styles.container}>
        {groups.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 20,
              fontFamily: "RobotoBold",
            }}
          >
            No groups found, try adding one!😀
          </Text>
        ) : (
          groups.map((group) => (
            <Link
              key={group._id}
              href={{
                pathname: "/(chat)/[chatid]",
                params: { chatid: group._id },
              }}
              asChild
            >
              <TouchableOpacity style={styles.group}>
                <Image
                  source={{ uri: group.icon_url }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "RobotoBold",
                    }}
                  >
                    {group.name}
                  </Text>
                  <Text style={{ color: "#888" }}>{group.description}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        )}
      </ScrollView>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Enter your name</Dialog.Title>
        <Dialog.Input onChangeText={setName} value={name} />
        <Dialog.Button label="Set Name" onPress={setUser} />
      </Dialog.Container>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  group: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 3,
    shadowRadius: 3.84,
  },
});

export default index;
