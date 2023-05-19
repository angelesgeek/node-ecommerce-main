const bcryptjs = require("bcryptjs");
const db = require("../database/models");

const controller = {
  sendMessage: async function (req, res) {
    await db.Mensaje.create({
      remitente: req.body.remitente,
      mensaje: req.body.mensaje,
    });
    return res.redirect("/profile");
  },
  sendResponse: async function (req, res) {
    let mensaje = await db.Mensaje.findByPk(req.body.id);
    console.log("buscar mensaje")
    if (mensaje) {
      console.log("await update")
      console.log("respuesta " + req.body.respuesta)
      console.log("id " + mensaje.id)
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