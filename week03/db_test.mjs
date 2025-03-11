import sqlite3 from "sqlite3";

const db = new sqlite3.Database(
  "questions.sqlite",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the questions database.");
  }
);

let sql = "SELECT * FROM answer";
let result = [];

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error(err.message);
  }
  rows.forEach((row) => {
    result.push(row);
  });
});

result.forEach((row) => console.log(row));
