const db = require("../database/models");
const fs = require("fs");
const PDFDocument = require("pdfkit");


const controller = {
  index: async function (req, res) {
    const { Op } = require("sequelize");

    let orders = [];

    if (req.query.userId && req.query.userId.trim() !== "") {
      let userdb = await db.User.findOne({
        where: {
          id_app: req.query.id_app,
        },
      });

      if (!userdb) {
        // Usuario no encontrado, devuelve un mensaje de error o redirige a una página de error
        return res.render("error", { error: "Usuario no encontrado" });
      }

      orders = await db.Order.findAll({
        include: { model: db.User, as: "user" },
        where: {
          [Op.or]: [
            { userId: userdb.id },
            { userId: null, id_app: userdb.id_app },
          ],
        },
      });
    } else {
      orders = await db.Order.findAll({
        include: { model: db.User, as: "user" },
      });
    }

    return res.render("orders", {
      orders: orders,
      userLogged: req.session.userLogged,
      req: req, // Pasar req como variable local
    });
  },



  detail: async function (req, res) {
    try {
      let order = await db.Order.findByPk(req.params.id);
      if (!order) {
        return res.status(404).send("Pedido no encontrado");
      }
      return res.render("order", { order: order, userLogged: req.session.userLogged });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error al obtener los detalles del pedido");
    }
  },


  generatePDF: async function (req, res) {
    try {
      const order = await db.Order.findByPk(req.params.id);
      if (!order) {
        return res.status(404).send("Pedido no encontrado");
      }

      // Crear el documento PDF
      const doc = new PDFDocument();

      // Definir el nombre del archivo de salida
      const filename = `pedido_${order.id}.pdf`;

      // Crear el stream de escritura para el archivo PDF
      const stream = fs.createWriteStream(filename);

      // Agregar contenido al documento PDF
      doc.fontSize(18).text("Detalles del pedido", { align: "center" });
      doc.fontSize(12).text(`ID de pedido: ${order.id}`);
      doc.fontSize(12).text(`ID de cliente: ${order.clientId}`);
      doc.fontSize(12).text(`Total: ${order.total}`);

      // Finalizar el documento y guardar el archivo
      doc.end();
      doc.pipe(stream);
      stream.on("finish", () => {
        // Descargar el archivo PDF
        res.download(filename, () => {
          // Eliminar el archivo después de la descarga
          fs.unlinkSync(filename);
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error al generar el PDF del pedido");
    }
  },
};

module.exports = controller;
