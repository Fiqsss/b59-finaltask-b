const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const {
  uploadImg , AuthLogin
} = require("./middlewares/PicturesValidation");

const { isLogin, isAlreadyLoggedIn } = require("./middlewares/AuthLogin");

const { renderRegister,renderLogin,authRegister,authLogin,logout } = require("./controller/auth");
const {renderKabupaten,renderDetailKabupaten,addKabupaten,deleteKabupaten,editKabupaten} = require("./controller/KabupatenController");
const {renderProvinsi,renderDetailProvinsi,addProvinsi,deleteProvinsi,editProvinsi} = require("./controller/ProvinsiController");



// Provinsi
router.get("/provinsi", renderProvinsi);
router.get("/detailprovinsi/:id", renderDetailProvinsi);
router.post("/addprovinsi",isLogin, uploadImg.single("photo"), addProvinsi);
router.post("/deleteprovinsi/:id", isLogin, deleteProvinsi);
router.post("/editprovinsi/:id",isLogin, uploadImg.single("photo"), editProvinsi);

// Kabupaten
router.get("/kabupaten", renderKabupaten);
router.post("/deletekabupaten/:id",isLogin, deleteKabupaten);
router.get("/detailkabupaten/:id", renderDetailKabupaten);
router.post("/addkabupaten",isLogin, uploadImg.single("photo"), addKabupaten);
router.post("/editkabupaten/:id",isLogin, uploadImg.single("photo"), editKabupaten);

// Authentication
router.get("/",isAlreadyLoggedIn, renderLogin);
router.get("/login",isAlreadyLoggedIn, renderLogin);
router.get("/register",isAlreadyLoggedIn, renderRegister);
router.get("/logout", logout);
router.post("/login", authLogin);
router.post("/register", authRegister);


module.exports = router;
