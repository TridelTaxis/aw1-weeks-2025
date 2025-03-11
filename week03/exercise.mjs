import dayjs from "dayjs";
import sqlite from "sqlite3";

const db = new sqlite.Database("questions.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the questions database.");
});

// Oggetto rappresentante le domande (con le sue proprietà e metodi)
function Question(id, text, email, userId, date) {
  this.id = id;
  this.text = text;
  this.email = email;
  this.userId = userId;
  this.date = dayjs(date);

  // metodo per prendere tutte le risposte della Question instanziata (3)
  this.getAnswers = () => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT answer.*, user.email FROM answer JOIN user ON answer.authorId = user.id WHERE answer.questionId = ?";
      db.all(sql, [this.id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            rows.map(
              (row) =>
                new Answer(
                  row.id,
                  row.text,
                  row.email,
                  row.authorId,
                  row.date,
                  row.score
                )
            )
          );
        }
      });
    });
  };

  // metodo per aggiungere una nuova risposta di un autore esistente alla Question instanziata (4)
  this.addAnswer = (answer) => {};

  // metodo per votare una risposta esistente, con up = +1 e down = -1 (5)
  this.voteAnswer = (answerId, value) => {};
}

// Oggetto rappresentante le risposte (con le sue proprietà)
function Answer(id, text, email, userId, date, score = 0) {
  this.id = id;
  this.text = text;
  this.email = email;
  this.userId = userId;
  this.score = score;
  this.date = dayjs(date);
}

// Oggetto rappresentante la lista di domande (con i suoi metodi)
function QuestionList() {
  // metodo per recuperare una singola Question dato il suo ID (1)
  this.getQuestion = (id) => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT question.*, user.email FROM question JOIN user ON question.authorId = user.id WHERE question.id=?";
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row !== undefined) {
          resolve(
            new Question(row.id, row.text, row.email, row.userId, row.date)
          );
        } else {
          resolve("Question not found");
        }
      });
    });
  };

  // metodo per aggiungere una nuova Question di un autore esistente (2)
  this.addQuestion = (question) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO question (text, authorId, date) VALUES (?, ?, ?)";
      db.run(
        sql,
        [question.text, question.userId, question.date],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  };
}

// funzione per il test
async function main() {
  const ql = new QuestionList();
  const question = await ql.getQuestion(1);
  console.log(question);
  console.log(await question.getAnswers());
  return;
}

main();
