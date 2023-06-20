const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const { check } = require("express-validator");

const controller = require("../controllers/authController");
const redirectIfAutenticated = require("../middlewares/redirectIfAutenticated");
const authMiddleware = require("../middlewares/authMiddleware");
const userValidationsLogin = require("../middlewares/userValidationsLogin");

router.get("/login", redirectIfAutenticated, controller.showLogin);
router.post("/login", controller.login);

router.get("/register", controller.showRegister);
router.post("/register", controller.register);

router.post("/logout", controller.logout);
router.get("/profile", authMiddleware, controller.profile);

router.get("/edit/:id", authMiddleware, controller.edit); 
router.put("/editUsers/:id", authMiddleware, controller.update); 

router.get("/delete/:id", controller.delete);




module.exports = router;
