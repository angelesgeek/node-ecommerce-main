const db = require("../database/models");

const controller = {
  index: async function (req, res) {

    let users = await db.User.findAll();
    return res.render("list", { users });

  },

};

module.exports = controller;
