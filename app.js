//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://akshatharnavada:password@cluster0.xhvbb9u.mongodb.net/userDB?retryWrites=true&w=majority"
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const hash = bcrypt.hashSync(req.body.password, salt);

  const newUser = new User({
    email: req.body.username,
    // password: md5(req.body.password),
    password: hash,
  });
  newUser
    .save()
    .then(() => {
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  // const password = md5(req.body.password);
  const password = req.body.password;
  User.findOne({ email: username })
    .then((foundUser) => {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        res.render("secrets");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
