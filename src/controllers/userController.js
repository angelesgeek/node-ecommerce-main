const db = require("../database/models");

const controller = {
  index: async function (req, res) {
    let users = await db.User.findAll({ where: { rol: 0 } });
    return res.render("list", { users, userLogged: req.session.userLogged });
  },

  indexAdmin: async function (req, res) {
    let users = await db.User.findAll({ where: { rol: 1 } });
    return res.render("listAdmin", { users, userLogged: req.session.userLogged });
  },

  indexVendor: async function (req, res) {
    let users = await db.User.findAll({ where: { rol: 2 } });
    return res.render("listVendor", { users, userLogged: req.session.userLogged });
  },
};

module.exports = controller;

