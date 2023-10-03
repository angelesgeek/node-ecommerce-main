const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const { check } = require("express-validator");

const controller = require("../controllers/messageController");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");

router.post("/sendMessage", maintenanceMiddleware, controller.sendMessage);
router.post("/sendResponse", maintenanceMiddleware, controller.sendResponse);

module.exports = router;