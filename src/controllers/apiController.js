const db = require("../database/models");

module.exports = {
  product: async function (req, res) {
    let product = await db.Product.findByPk(req.params.id);
    return res.json(product);
  },


  
  checkout: async function (req, res) {
    
    let order = await db.Order.create(
      { ...req.body, 
        userId: req.session.userLogged.id,
        id_app: req.session.userLogged.id_app
      },
      {
        include: db.Order.OrderItems,
      }
    );
    res.json({ ok: true, status: 200, order: order });
  },

};
