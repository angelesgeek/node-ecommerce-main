const express = require('express');
const router = express.Router();
const controller = require("../controllers/orderController");

/* GET orders listing. */
router.post("/", authMiddleware, controller.index);
router.get("/", authMiddleware, controller.index);
router.get("/detail/:id", authMiddleware, controller.detail);

router.get("/detail/:id/pdf", authMiddleware, controller.generatePDF);

module.exports = router;
