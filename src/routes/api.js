const express = require("express");
const router = express.Router();

const controller = require("../controllers/apiController");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");

router.get("/product/:id", maintenanceMiddleware, controller.product);
router.post("/checkout",  maintenanceMiddleware, controller.checkout);

module.exports = router;
