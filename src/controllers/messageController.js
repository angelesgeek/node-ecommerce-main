const bcryptjs = require("bcryptjs");
const db = require("../database/models");

const controller = {
  sendMessage: async function (req, res) {
    await db.Messages.create({
      sender: req.body.sender,
      message: req.body.message,
      userId: parseInt(req.body.userId), // Convertir a entero
    });
    return res.redirect("/profile");
  },

  sendResponse: async function (req, res) {
    let message = await db.Messages.findByPk(req.body.id);
    
    if (message) {
      await message.update({
        response: req.body.respuesta,
        message: message.message,
        id: message.id,
       date: message.date
      });
    }
    return res.redirect("/profile");
  },
};



module.exports = controller;