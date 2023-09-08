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

router.get("/register", authMiddleware, controller.showRegister);
router.post("/register", authMiddleware, controller.register);

router.post("/logout", controller.logout);
router.get("/profile", authMiddleware, controller.profile);

router.get("/edit/:id", controller.edit); 
router.put("/editUsers/:id", controller.update); 

router.get("/delete/:id", controller.delete);

router.get("/profile/:userId", authMiddleware, controller.profile);


module.exports = router;
