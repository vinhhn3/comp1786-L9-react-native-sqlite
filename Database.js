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

const initDatabase = () => {
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

const getTodos = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM todos",
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM todos WHERE id = ?",
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const addTodo = (title, description) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO todos (title, description) VALUES (?, ?)",
        [title, description],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const Database = {
  initDatabase,
  addTodo,
  getTodos,
  deleteTodo,
};

export default Database;
