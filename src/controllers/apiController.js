const db = require("../database/models");

module.exports = {
  product: async function (req, res) {
    let product = await db.Product.findByPk(req.params.id);
    return res.json(product);
  },
  checkout: async function (req, res) {
    let id_app;
  
    if (req.session.userLogged.id_app === null) {
      const otherUserId = req.body.id_app;
      const otherUser = await db.User.findByPk(otherUserId);
      if (otherUser && otherUser.id_app) {
        id_app = otherUser.id_app;
        req.session.selectedUser = otherUser;
      }
    } else {
      id_app = req.session.userLogged.id_app;
      req.session.selectedUser = null;
    }
  
    let order = await db.Order.create(
      {
        ...req.body,
        userId: req.session.userLogged.id,
        id_app: id_app,
      },
      {
        include: db.Order.OrderItems,
      }
    );
  
    res.json({ ok: true, status: 200, order: order });
  }

};

