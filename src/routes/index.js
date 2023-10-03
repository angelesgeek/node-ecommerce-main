const express = require("express");
const router = express.Router();

const controller = require("../controllers/homeController");
const authMiddleware = require("../middlewares/authMiddleware");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");
/* GET home page. */
router.get("/", maintenanceMiddleware, controller.home);
router.get("/cart", maintenanceMiddleware, authMiddleware, controller.cart);
router.get("/order/:id", maintenanceMiddleware, authMiddleware, controller.order);
router.post("/deleteOrder/:id", maintenanceMiddleware, controller.deleteOrder);
router.post("/updateOrderStatus", maintenanceMiddleware, controller.updateOrderStatus);

module.exports = router;