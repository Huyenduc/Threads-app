import { StyleSheet, Text, View } from "react-native";

export default function NewPost() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Post</Text>
      <Text>Create a new post...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
