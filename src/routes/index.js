const express = require("express");
const router = express.Router();

const controller = require("../controllers/homeController");
const authMiddleware = require("../middlewares/authMiddleware");

/* GET home page. */
router.get("/", controller.home);
router.get("/cart", authMiddleware, controller.cart);
router.get("/order/:id", authMiddleware, controller.order);
router.post("/deleteOrder/:id", controller.deleteOrder);
router.post("/updateOrderStatus", controller.updateOrderStatus);

module.exports = router;