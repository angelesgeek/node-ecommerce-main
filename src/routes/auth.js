const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const { check } = require("express-validator");

const controller = require("../controllers/authController");
const redirectIfAutenticated = require("../middlewares/redirectIfAutenticated");
const authMiddleware = require("../middlewares/authMiddleware");
const userValidationsLogin = require("../middlewares/userValidationsLogin");
const registerUserMiddleware = require("../middlewares/registerUserMiddleware");
const editUserMiddleware = require("../middlewares/editUserMiddleware");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");


router.get("/login", redirectIfAutenticated, controller.showLogin);
router.post("/login", controller.login);

router.get("/register", maintenanceMiddleware, authMiddleware, registerUserMiddleware, controller.showRegister);
router.post("/register", maintenanceMiddleware, authMiddleware, registerUserMiddleware, controller.register);

router.post("/logout", controller.logout);
router.get("/profile", maintenanceMiddleware, authMiddleware, controller.profile);

router.get("/edit/:id", authMiddleware, maintenanceMiddleware, editUserMiddleware, controller.edit);
router.put("/editUsers/:id", authMiddleware, maintenanceMiddleware, editUserMiddleware, controller.update);

router.get("/delete/:id", authMiddleware, maintenanceMiddleware, controller.delete);

router.get("/profile/:userId", maintenanceMiddleware, authMiddleware, controller.profile);

router.get("/maintenance", authMiddleware, maintenanceMiddleware, controller.activateMaintenance);
router.get("/maintenanceOff", authMiddleware, controller.deactivateMaintenanceMode);



module.exports = router;
