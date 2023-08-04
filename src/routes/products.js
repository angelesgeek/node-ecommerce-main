const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/productController");

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
router.get("/", controller.index);

/* GET Product */
router.get("/detail/:id", controller.detail);

// Rutas para crear
router.get("/create", controller.create);
router.post("/", upload.single("img"), controller.store);

// Rutas para editar
router.get("/edit/:id", controller.edit);
router.put("/:id", upload.single("img"), controller.update);

// Ruta para eliminar
router.delete("/:id", controller.delete);

// Ruta para búsqueda
router.get("/searchProducts", controller.searchProducts);

module.exports = router;
