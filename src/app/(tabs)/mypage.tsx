import { ThemedView } from "@/components/ThemedView";
import { Text } from "react-native";

export default function MyPageScreen() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>My Page Screen</Text>
    </ThemedView>
  );
}
