const session = require("express-session");

const bcrypt = require("bcrypt");
const pool = require("../db");

exports.renderRegister = (req, res) => {
  res.render("registrasi", { page: "register" });
};

exports.renderLogin = (req, res) => {
  res.render("login", { page: "login" });
};
exports.authRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users_tb WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      const errorMessage =
        existingUser.rows[0].username === username
          ? "Username already exists"
          : "Email already exists";

      req.session.flash = { message: errorMessage, type: "error" };
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users_tb (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    req.session.flash = {
      message: "Registration successful!",
      type: "success",
    };
    return res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.session.flash = {
      message: "An error occurred during registration.",
      type: "error",
    };
    return res.redirect("/register");
  }
};

exports.authLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await pool.query(
      "SELECT * FROM users_tb WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      req.session.flash = {
        message: "Invalid username or password.",
        type: "error",
      };
      return res.redirect("/login");
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      req.session.flash = {
        message: "Invalid username or password.",
        type: "error",
      };
      return res.redirect("/login");
    }

    const sessionuser = (req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    });

    console.log(req.session.user);

    req.session.flash = { message: "Login successful!", type: "success" };
    return res.redirect("/provinsi");
  } catch (error) {
    console.error("Login error:", error);
    req.session.flash = {
      message: "An error occurred during login.",
      type: "error",
    };
    return res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
