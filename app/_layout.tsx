import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, Link, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL!,
  {
    unsavedChangesWarning: false,
  }
);
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();
  return (
    <ConvexProvider client={convex}>
      <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#EEA217",
        },
        headerTintColor: "#fff",
        contentStyle:{
          backgroundColor: "#fff"
        
        }
      }}>
        <Stack.Screen name="index" options={{ 
          headerTitle: "My Chats",
          headerRight: () => (
              <TouchableOpacity onPress={(()=>router.push('/(modal)/create'))}>
                <Ionicons  name="add" size={32} color={'white'}/>
              </TouchableOpacity>
          )
        }} />
               <Stack.Screen name="(modal)/create" options={{ 
          headerTitle: "Create Chat",
          presentation: "modal",
          animation: "slide_from_bottom",
          headerLeft: () => (
              <TouchableOpacity onPress={(()=>router.back())}>
                <Ionicons  name="close-outline" size={32} color={'white'}/>
              </TouchableOpacity>
          )
        }} />
        <Stack.Screen name="(chat)/[chatid]" options={{ headerTitle: "Test" }} />
      </Stack>
    </ConvexProvider>
  );
}
