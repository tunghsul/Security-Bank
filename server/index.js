require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createPool({
  host: "mysql_db", // the host name MYSQL_DATABASE: node_mysql
  user: "MYSQL_USER", // database user MYSQL_USER: MYSQL_USER
  password: "MYSQL_PASSWORD", // database user password MYSQL_PASSWORD: MYSQL_PASSWORD
  database: "bank", // database name MYSQL_HOST_IP: mysql_db
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hi There");
});

// //get all of the books in the database
// app.get("/get", (req, res) => {
//   const SelectQuery = " SELECT * FROM books_reviews";
//   db.query(SelectQuery, (err, result) => {
//     res.send(result);
//   });
// });

// register an account to the database
app.post("/register", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  // password = await bcrypt.hash(password, 8);
  const InsertQuery = "INSERT INTO users (name, password) VALUES (?, ?)";
  db.query(InsertQuery, [userName, password], (err, result) => {
    console.log(result);
    if (err) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(200);
  });
});

// login
app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  const user = { name: userName };
  const insertQuery =
    "SELECT password FROM users WHERE name='" + userName + "';";

  db.query(insertQuery, (err, result) => {
    if (err) {
      res.sendStatus(400);
      return;
    }

    if (result[0].password == password) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "60s",
      });
      res.status(200).send(JSON.stringify({ message: "success", accessToken }));
    } else {
      res.sendStatus(404);
    }
  });
});

app.post("/account", authenticationToken, (req, res) => {
  res.sendStatus(200);
});

function authenticationToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

app.post("/deposit", authenticationToken, (req, res) => {
  const userName = req.body.username;
  const amount = req.body.amount;
  const insertQuery =
    "UPDATE users SET users.balance = users.balance + " +
    amount +
    " WHERE name='" +
    userName +
    "'";
  db.query(insertQuery, (err, result) => {
    if (err) {
      res.sendStatus(400);
      return;
    }

    res.sendStatus(200);
  });
});

app.post("/withdraw", authenticationToken, (req, res) => {
  const userName = req.body.username;
  const amount = req.body.amount;
  const insertQuery =
    "UPDATE users SET users.balance = users.balance - " +
    amount +
    " WHERE name='" +
    userName +
    "'";
  db.query(insertQuery, (err, result) => {
    if (err) {
      res.sendStatus(400);
      return;
    }

    res.sendStatus(200);
  });
});

app.listen("3001", () => {});

app.use(cors());
