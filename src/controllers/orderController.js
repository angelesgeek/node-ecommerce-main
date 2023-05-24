const db = require("../database/models");
const { param } = require("../routes/orders");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const controller = {
  index: async function (req, res) {

    let orders = await db.Order.findAll();
    return res.render("orders", { "orders": orders, "user": req.session.userLogged });

  },
  detail: async function (req, res) {

    let order = await db.Order.findByPk(req.params.id);

    return res.render("order", { order }, { "user": req.session.userLogged });
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