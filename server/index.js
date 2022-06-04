require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require('bcryptjs');

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

   // fixed improper input validation with negative values
  if (parseFloat(balance) > 4294967295.99 || parseFloat(balance) < 0) {
    return res.sendStatus(400);
  }

  const InsertQuery = "INSERT INTO users (name, password, balance) VALUES (?, ?, TRUNCATE(?, 2))"; // updated to prevent rounding
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
  const password = req.body.password;

  
  // REMOVED SQL INJECTION
  const insertQuery =
    "SELECT name, password FROM users WHERE name = ?";

  db.query(insertQuery, [userName], (err, result) => {
    console.log(bcrypt.compare(userName, result[0].name));
    if (err) {
      return res.sendStatus(400);
    }

    // bcrypt.compare(userName, result[0].name, function (err, res) {
    //   // res === true
    // });
    
    // console.log(JSON.stringify(result));

    if (result[0].password !== password) {
      return res.sendStatus(404);
    }
    const user = { name: userName };

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

  // fixed improper input validation with negative values
  if (parseFloat(amount) > 4294967295.99 || parseFloat(amount) < 0) {
    return res.sendStatus(400);
  }

  // REMOVED SQL INJECTION
  const insertQuery =
    "UPDATE users SET users.balance = users.balance + " +
    "IF(TRUNCATE(?, 2) > 4294967295.99, 4294967295.99, TRUNCATE(?, 2)) " + // constrain to certain range and prevent rounding
    "WHERE name= ?";

  db.query(insertQuery, [amount, amount, userName], (err, result) => {
    if (err) {
      return res.sendStatus(400);
    }

    return res.sendStatus(200);
  });
});

app.post("/withdraw", authenticationToken, (req, res) => {
  const userName = req.body.username;
  const amount = req.body.amount;

  // fixed improper input validation with negative values
  if (parseFloat(amount) > 4294967295.99 || parseFloat(amount) < 0) {
    return res.sendStatus(400);
  }

  // REMOVED SQL INJECTION
  const insertQuery =
    "UPDATE users SET users.balance = users.balance - " +
    "IF(TRUNCATE(?, 2) > 4294967295.99, 4294967295.99, TRUNCATE(?, 2)) " +  // constrain to certain range and prevent rounding 
    "WHERE name= ?";

  db.query(insertQuery, [amount, amount, userName], (err, result) => {
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

app.listen("3001", () => { });

app.use(cors());
