const express = require('express');
const router = express.Router();
const controller = require("../controllers/orderController");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const ordersAuthorizationMiddleware = require("../middlewares/ordersAuthorizationMiddleware");

/* GET orders listing. */
router.post("/", ordersAuthorizationMiddleware, maintenanceMiddleware, controller.index);
router.get("/", adminMiddleware, maintenanceMiddleware,  controller.index);
router.get("/detail/:id", adminMiddleware,  maintenanceMiddleware, controller.detail);

router.get("/detail/:id/pdf", adminMiddleware, maintenanceMiddleware, controller.generatePDF);

module.exports = router;
