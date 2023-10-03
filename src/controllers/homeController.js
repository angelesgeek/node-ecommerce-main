const db = require("../database/models");
const { Op } = require("sequelize");

module.exports = {
  home: async function (req, res) {
    let products = await db.Product.findAll({
      where: {
        marked: 1,
      },
    });

    return res.render("index", {
      title: "E-Commerce",
      products,
      userLogged: req.session.userLogged,
      currentPage: 1,
      totalPages: products.length,
      isHomePage: true,
    });
  },

  cart: async function (req, res) {
    let users = await db.User.findAll();
    return res.render("cart", { "userLogged": req.session.userLogged, "users": users, });
  },

  order: async function (req, res) {
    let order = await db.Order.findByPk(req.params.id, {
      include: db.Order.OrderItems,
    });

    // res.send(order);
    return res.render("order", { order, "user": req.session.userLogged });
  },

  deleteOrder: async function (req, res) {
    const orderId = req.params.id;

    try {
      // Inicia una transacción
      const t = await db.sequelize.transaction();

      // Elimina las filas relacionadas en la tabla 'orderitems'
      await db.OrderItem.destroy({
        where: { orderId: orderId },
        transaction: t
      });

      // Elimina la orden en la tabla 'Orders'
      await db.Order.destroy({
        where: { id: orderId },
        transaction: t
      });

      // Confirma la transacción
      await t.commit();

      console.log("Pedido y filas relacionadas eliminados:", orderId);

      return res.redirect("/orders");
    } catch (error) {

      // Revierte la transacción en caso de error
      await t.rollback();

      console.error(error);
      return res.status(500).send("Error al eliminar el pedido");
    }


  },

  updateOrderStatus: async function (req, res) {
    console.log("por acá pasa")
    try {
      const dataToUpdate = req.body;

      for (const [key, value] of Object.entries(dataToUpdate)) {
        if (key.startsWith('statusSelect_')) {
          const orderId = key.replace('statusSelect_', '');
          const newStatus = parseInt(value);

          const order = await db.Order.findByPk(orderId);
          if (order) {
            order.order_status = newStatus;
            await order.save();
          }
        }
      }
      console.log("por acá pasa 2")
      return res.json({ message: 'Estados de pedido actualizados con éxito' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar los estados de pedido' });
    }
  },

};
