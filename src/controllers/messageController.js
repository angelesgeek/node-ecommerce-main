const bcryptjs = require("bcryptjs");
const db = require("../database/models");

const controller = {
    sendMessage: async function(req, res) {
      console.log("controller sendMessager")
        await db.Mensaje.create({
          remitente: req.body.remitente,
          mensaje: req.body.mensaje,
        });
        return res.redirect("/profile");
    },
    
};
      
    
    
    module.exports = controller;