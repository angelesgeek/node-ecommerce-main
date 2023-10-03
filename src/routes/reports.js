const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/reportsController");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");


router.get("/", maintenanceMiddleware, controller.renderReports);

module.exports = router;
