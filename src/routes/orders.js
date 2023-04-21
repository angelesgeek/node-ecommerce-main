const express = require('express');
const path = require("path");
const router = express.Router();
const controller = require("../controllers/orderController");

/* GET orders listing. */
router.get("/", controller.index);
router.get("/detail/:id", controller.detail);

module.exports = router;