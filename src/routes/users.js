const express = require('express');
const path = require("path");
const router = express.Router();
const controller = require("../controllers/userController");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");

// Ruta para clientes
router.get("/clients", maintenanceMiddleware, controller.index);

// Ruta para vendedores
router.get("/vendors", maintenanceMiddleware, controller.indexVendor);

// Ruta para administradores
router.get("/admin", maintenanceMiddleware, controller.indexAdmin);



module.exports = router;

