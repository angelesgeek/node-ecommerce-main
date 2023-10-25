const db = require("../database/models");
const { Op } = require('sequelize');

const controller = {
  index: async function (req, res) {
    let users = await db.User.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { rol: 0 },
          { rol: { [db.Sequelize.Op.between]: [2, 9] } }
        ]
      }
    });
    return res.render("list", { users, userLogged: req.session.userLogged });
  },


  indexAdmin: async function (req, res) {
    const { Op } = require('sequelize');
    let users = await db.User.findAll({
      where: {
        rol: {
          [Op.or]: [1, { [Op.between]: [40, 50] }]
        }
      }
    });
    return res.render("listAdmin", { users, userLogged: req.session.userLogged });
  },

  indexVendor: async function (req, res) {
    let users = await db.User.findAll({
      where: {
        rol: {
          [Op.between]: [10, 39]
        }
      }
    });

    return res.render("listVendor", { users, userLogged: req.session.userLogged });
  },

};

module.exports = controller;

