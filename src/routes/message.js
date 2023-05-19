const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const { check } = require("express-validator");

const controller = require("../controllers/messageController");

router.post("/sendMessage", controller.sendMessage);
router.post("/sendResponse", controller.sendResponse);

module.exports = router;