const db = require("../database/models");
module.exports = {
  home: async function (req, res) {
    let products = await db.Product.findAll({
      where: {
        marked: 1,
      },
    });
    console.log("index userLogged "+ req.session.userLogged)
    return res.render("index", { title: "E-Commerce", products, "userLogged":req.session.userLogged, currentPage:1, totalPages:products.length });
  },
  cart: function (req, res) {
    return res.render("cart", {"userLogged":req.session.userLogged});
  },
  order: async function (req, res) {
    let order = await db.Order.findByPk(req.params.id, {
      include: db.Order.OrderItems,
    });
   
    // res.send(order);
    return res.render("order", {order, "user": req.session.userLogged });
  },
};
