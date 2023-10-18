const express = require('express');
const path = require("path");
const router = express.Router();
const controller = require("../controllers/userController");
const  usersMiddleware = require("../middlewares/usersMiddleware");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");


const authMiddleware = require("../middlewares/authMiddleware");
// Ruta para clientes
router.get("/clients", authMiddleware, usersMiddleware, maintenanceMiddleware, controller.index);

// Ruta para vendedores
router.get("/vendors", authMiddleware, usersMiddleware, maintenanceMiddleware, controller.indexVendor);

// Ruta para administradores
router.get("/admin", authMiddleware, usersMiddleware, maintenanceMiddleware, controller.indexAdmin);



module.exports = router;

