import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { Text, View } from "react-native";

const SearchScreen = () => {
  // TODO: Implement Search screen
  const db = useSQLiteContext();

  return (
    <View>
      <Text>Search Screen</Text>
    </View>
  );
};

export default SearchScreen;
