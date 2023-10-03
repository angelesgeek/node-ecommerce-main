const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const { check } = require("express-validator");

const controller = require("../controllers/authController");
const redirectIfAutenticated = require("../middlewares/redirectIfAutenticated");
const authMiddleware = require("../middlewares/authMiddleware");
const userValidationsLogin = require("../middlewares/userValidationsLogin");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");

router.get("/login", redirectIfAutenticated, controller.showLogin);
router.post("/login", controller.login);

router.get("/register", maintenanceMiddleware, authMiddleware, controller.showRegister);
router.post("/register", maintenanceMiddleware, authMiddleware, controller.register);

router.post("/logout", controller.logout);
router.get("/profile", maintenanceMiddleware, authMiddleware, controller.profile);

router.get("/edit/:id", maintenanceMiddleware, controller.edit);
router.put("/editUsers/:id", maintenanceMiddleware, controller.update);

router.get("/delete/:id", maintenanceMiddleware, controller.delete);

router.get("/profile/:userId", maintenanceMiddleware, authMiddleware, controller.profile);

router.get("/maintenance", maintenanceMiddleware, controller.activateMaintenance);
router.get("/maintenanceOff", controller.deactivateMaintenanceMode);



module.exports = router;
