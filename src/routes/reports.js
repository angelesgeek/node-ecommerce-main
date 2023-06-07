const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/reportsController");


router.get("/", controller.renderReports);

module.exports = router;
