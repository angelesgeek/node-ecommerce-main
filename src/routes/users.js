const express = require('express');
const path = require("path");
const router = express.Router();
const controller = require("../controllers/userController");

/* GET users listing. */
router.get("/", controller.index);
  


module.exports = router;
