import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import db from "../Database";

const HomeScreen = ({ navigation }) => {
  const [todos, setTodos] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = () => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM todos;", [], (_, { rows }) => {
          setTodos(rows._array);
        });
      });
    };

    fetchData();
  }, [isFocused]);

  const handleDeleteTodo = (id) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM todos WHERE id = ?;", [id], () => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      });
    });
  };

  const renderTodoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => navigation.navigate("Detail", { todo: item })}
    >
      <Text>{item.title}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTodo(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Entry")}
      >
        <Text style={styles.addButtonText}>Add Todo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "white",
  },
  addButton: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HomeScreen;
