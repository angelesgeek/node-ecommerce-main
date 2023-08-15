const express = require('express');
const router = express.Router();
const controller = require("../controllers/orderController");

/* GET orders listing. */
router.get("/", controller.index);
router.get("/detail/:id", controller.detail);

router.get("/detail/:id/pdf", controller.generatePDF);

module.exports = router;
