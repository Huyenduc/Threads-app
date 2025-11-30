import { Button, StyleSheet, View } from "react-native";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function FakeTypingInput() {
  const targetText =
    "Xin chào, đây là nội dung được AI gen với hiệu ứng typing ✨";

  const progress = useSharedValue(0);

  // derive visible text dựa trên progress
  const visibleText = useDerivedValue(() => {
    const len = Math.floor(progress.value * targetText.length);
    return targetText.slice(0, len);
  });

  const handleGenerate = () => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: targetText.length * 80 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.fakeInput}>
        <Animated.Text style={styles.text}>{visibleText.value}</Animated.Text>
      </View>
      <Button title="Generate AI Text" onPress={handleGenerate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  fakeInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    minHeight: 50,
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});
