## Step 1: Set up the project

First, create a new React Native project using the React Native CLI:

```
npx react-native init TodoApp
cd TodoApp
```

The final folder structure will be like this:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e0d97c1f-7341-4e4b-8e25-cd76424c988a/Untitled.png)

The final Images of the application

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/78470663-9e69-4f81-ae15-46df0d52ba86/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/59d174cd-d1dc-45c1-a31c-f9f45d5a1a0a/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a0598518-d96e-41f1-b2b7-918f1625ac9e/Untitled.png)

## Step 2: Install dependencies

Install the required dependencies for SQLite and navigation:

```
npm install expo-sqlite @react-navigation/native @react-navigation/stack
```

## Step 3: Create the database

Create a file named **`Database.js`** in the root of your project and add the following code:

```jsx
import * as SQLite from "expo-sqlite";

const database_name = "TodoApp.db";
const database_version = "1.0";
const database_displayname = "Todo App Database";
const database_size = 200000;

const db = SQLite.openDatabase(
  database_name,
  database_version,
  database_displayname,
  database_size
);

export const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT
      );`,
      [],
      () => console.log("Database and table created successfully."),
      (error) => console.log("Error occurred while creating the table.", error)
    );
  });
};

export default db;
```

## Step 4: Set up navigation

Create a new file named **`App.js`** in the root of your project and replace the default code with the following:

```jsx
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { initDatabase } from "./Database";
import DetailScreen from "./screens/DetailScreen";
import EntryScreen from "./screens/EntryScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
```

## Step 5: Create screens

Create three new files inside the **`screens`** directory: **`HomeScreen.js`**, **`EntryScreen.js`**, and **`DetailScreen.js`**.

### HomeScreen.js

In **`HomeScreen.js`**, add the following code:

```jsx
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
```

### EntryScreen.js

In **`EntryScreen.js`**, add the following code:

```jsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import db from "../Database";

const EntryScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTodo = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO todos (title, description) VALUES (?, ?);",
        [title, description],
        () => {
          navigation.navigate("Home");
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
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
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
    padding: 8,
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

export default EntryScreen;
```

### DetailScreen.js

In **`DetailScreen.js`**, add the following code:

```jsx
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
```
