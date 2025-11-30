import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { TAB_BAR_HEIGHT } from "@/constants/tabBar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTabBarAnimation } from "@/hooks/useTabBarAnimation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs, useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { translateY } = useTabBarAnimation();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: TAB_BAR_HEIGHT,
          paddingTop: 10,
          position: "absolute",
          ...(insets.bottom === 0 ? { paddingBottom: 3 } : {}),
          borderColor: "transparent",
          transform: [
            {
              translateY,
            },
          ],
        },
      }}
    >
      <Tabs.Screen
        name="(drawer)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              size={31}
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Octicons name="search" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="empty"
        options={{
          title: "New Post",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: Colors[colorScheme ?? "light"].bgIcon,
                borderRadius: 10,
                width: 50,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Octicons size={26} name={"plus"} color={color} />
            </View>
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to the modal new-post screen
            router.push("/new-post");
          },
        })}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Heart",
          tabBarIcon: ({ color, size, focused }) => (
            <Octicons
              size={size}
              name={focused ? "heart-fill" : "heart"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: "My Page",
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome6
              size={size}
              name={focused ? "user-large" : "user"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
