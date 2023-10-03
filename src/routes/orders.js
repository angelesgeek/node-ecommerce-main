const express = require('express');
const router = express.Router();
const controller = require("../controllers/orderController");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");


/* GET orders listing. */
router.post("/", maintenanceMiddleware, authMiddleware, controller.index);
router.get("/", maintenanceMiddleware, authMiddleware, controller.index);
router.get("/detail/:id", maintenanceMiddleware, authMiddleware, controller.detail);

router.get("/detail/:id/pdf", maintenanceMiddleware, authMiddleware, controller.generatePDF);

module.exports = router;
