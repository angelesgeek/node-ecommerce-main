const db = require("../database/models");
const { param } = require("../routes/orders");

const controller = {
  index: async function (req, res) {
    
    let orders = await db.Order.findAll();
    return res.render("orders", { orders });
    
  },
  detail: async function (req, res) {
    
    let order = await db.Order.findByPk(req.params.id);
    //return res.send(order)
    return res.render("order", { order });
  },
  
};

module.exports = controller;