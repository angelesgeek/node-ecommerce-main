const bcryptjs = require("bcryptjs");
const db = require("../database/models");

const controller = {
  sendMessage: async function (req, res) {
    await db.Mensaje.create({
      remitente: req.body.remitente,
      mensaje: req.body.mensaje,
      userId: parseInt(req.body.userId), // Convertir a entero
    });
    return res.redirect("/profile");
  },

  sendResponse: async function (req, res) {
    let mensaje = await db.Mensaje.findByPk(req.body.id);
    
    if (mensaje) {
      await mensaje.update({
        respuesta: req.body.respuesta,
        mensaje: mensaje.mensaje,
        id: mensaje.id,
        fecha: mensaje.fecha
      });
    }
    return res.redirect("/profile");
  },
};



module.exports = controller;