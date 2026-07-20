import { useTabBarAnimation } from "@/hooks/useTabBarAnimation";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

export default function HomeScreen() {
  const { handleScroll, showTabBar } = useTabBarAnimation();

  useFocusEffect(
    useCallback(() => {
      showTabBar();
    }, [showTabBar]),
  );

  return (
    <Animated.ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={styles.container}
    >
      {/* Test content */}
      {Array.from({ length: 30 }).map((_, index) => (
        <View
          key={`item-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          style={styles.item}
        >
          <Text style={styles.text}>Item {index + 1}</Text>
          <Text style={styles.subtext}>
            Scroll down to hide the tab bar, scroll up to show it again
          </Text>
        </View>
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  subtext: {
    fontSize: 14,
    color: "#666",
  },
});
