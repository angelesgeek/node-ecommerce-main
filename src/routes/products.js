const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/productController");
const maintenanceMiddleware = require("../middlewares/maintenanceMiddleware");
const vendorAuthorizationMiddleware = require("../middlewares/vendorAuthorizationMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/products");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

/* GET home page. */
router.get("/", maintenanceMiddleware, controller.index);

/* GET Product */
router.get("/detail/:id", maintenanceMiddleware, controller.detail);

// Rutas para crear
router.get("/create", authMiddleware, vendorAuthorizationMiddleware, maintenanceMiddleware, controller.create);
router.post("/", upload.single("img"), maintenanceMiddleware, controller.store);

// Rutas para editar
router.get("/edit/:id", maintenanceMiddleware, vendorAuthorizationMiddleware, controller.edit);
router.put("/:id", upload.single("img"), maintenanceMiddleware, controller.update);

// Ruta para eliminar
router.delete("/:id", maintenanceMiddleware, controller.delete);

// Ruta para búsqueda
router.get("/searchProducts", maintenanceMiddleware, controller.searchProducts);

module.exports = router;
