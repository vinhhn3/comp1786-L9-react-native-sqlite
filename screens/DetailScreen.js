import React from "react";
import { StyleSheet, Text, View } from "react-native";

const DetailScreen = ({ route }) => {
  const { todo } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{todo.title}</Text>
      <Text style={styles.description}>{todo.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
  },
});

export default DetailScreen;
