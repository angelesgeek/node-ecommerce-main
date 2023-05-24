const express = require('express');
const path = require("path");
const router = express.Router();
const controller = require("../controllers/orderController");

/* GET orders listing. */
router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.get("/detail/:id/pdf", controller.generatePDF); // Ruta para generar el PDF

module.exports = router;