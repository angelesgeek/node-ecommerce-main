const express = require('express');
const path = require("path");
const router = express.Router();
const controller = require("../controllers/userController");

// Ruta para clientes
router.get("/clients", controller.index);

// Ruta para vendedores
router.get("/vendors", controller.indexVendor);
  
// Ruta para administradores
router.get("/admin", controller.indexAdmin);



module.exports = router;

