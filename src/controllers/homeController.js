const db = require("../database/models");
module.exports = {
  home: async function (req, res) {
    let products = await db.Product.findAll({
      where: {
        marked: 1,
      },
    });
    console.log("index userLogged "+ req.session.userLogged)
    return res.render("index", { title: "E-Commerce", products, "user":req.session.userLogged });
  },
  cart: function (req, res) {
    return res.render("cart", {"user":req.session.userLogged});
  },
  order: async function (req, res) {
    let order = await db.Order.findByPk(req.params.id, {
      include: db.Order.OrderItems,
    });
    // res.send(order);
    console.log("userlogged "+ req.session.userLogged)
    return res.render("order",  { "orders": orders, "user": req.session.userLogged });
  },
};
