require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

const db = mysql.createPool({
  host: "mysql_db", // the host name MYSQL_DATABASE: node_mysql
  user: "MYSQL_USER", // database user MYSQL_USER: MYSQL_USER
  password: "MYSQL_PASSWORD", // database user password MYSQL_PASSWORD: MYSQL_PASSWORD
  database: "bank", // database name MYSQL_HOST_IP: mysql_db
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// register an account to the database
app.post("/register", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  const balance = req.body.balance;
  // password = await bcrypt.hash(password, 8);
  const InsertQuery = "INSERT INTO users (name, password, balance) VALUES (?, ?, ?)";
  db.query(InsertQuery, [userName, password, balance], (err, result) => {
    console.log(result);
    if (err) {
      return res.sendStatus(400);
    }
    return res.sendStatus(200);
  });
});

// login
app.post("/login", (req, res) => {
  const userName = req.body.username;
  let password = "";
  if (req.body.password != "") {
    password = req.body.password;
  }
  
  const insertQuery =
    "select name, password from users where name ='" +
    userName +
    "' and password ='" +
    password +
    "';";

  db.query(insertQuery, (err, result) => {
    if (err) {
      return res.sendStatus(400);
    }

    if (result.length == 0 || result[0].password === undefined) {
      return res.sendStatus(404);
    }
    const user = { name: result[0].name };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "300s",
    });
    return res
      .status(200)
      .send(JSON.stringify({ message: "success", accessToken }));
  });
});

app.get("/account", authenticationToken, (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt_decode(token);
  const username = decoded["name"];
  if (username == null) {
    return res.sendStatus(404);
  }

  const insertQuery = "select balance from users where name = ?";

  db.query(insertQuery, [username], (err, result) => {
    if (err) {
      return res.sendStatus(400);
    }

    if (result.length == 0) {
      return res.sendStatus(404);
    }

    const balance = result[0].balance;
    return res
      .status(200)
      .send(JSON.stringify({ user: username, balance: balance }));
  });
});

app.post("/deposit", authenticationToken, (req, res) => {
  const userName = req.body.username;
  const amount = req.body.amount;
  const insertQuery =
    "UPDATE users SET users.balance = users.balance + " +
    "TRUNCATE(" + amount + ", 2) " +
    "WHERE name='" +
    userName +
    "'";
  db.query(insertQuery, (err, result) => {
    if (err) {
      return res.sendStatus(400);
    }

    return res.sendStatus(200);
  });
});

app.post("/withdraw", authenticationToken, (req, res) => {
  const userName = req.body.username;
  const amount = req.body.amount;
  const insertQuery =
    "UPDATE users SET users.balance = users.balance - " +
    "TRUNCATE(" + amount + ", 2) " +
    "WHERE name='" +
    userName +
    "'";
  db.query(insertQuery, (err, result) => {
    if (err) {
      return res.sendStatus(400);
    }

    return res.sendStatus(200);
  });
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

app.listen("3001", () => {});

app.use(cors());
