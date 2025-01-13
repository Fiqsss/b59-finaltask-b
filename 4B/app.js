const express = require("express");
const pool = require("./db");
const bodyParser = require("body-parser");
const routes = require("./route");
const { authLogin,authRegister, logout } = require("./controller/auth");
const app = express();
const session = require('express-session');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(session({
  secret: 'FpCeLxccG8', 
  resave: false,
  saveUninitialized: true
}))
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || {};
  delete req.session.flash;
  next();
});
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use("/", routes);


app.post("/register", authRegister);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
