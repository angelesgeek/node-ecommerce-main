const db = require("../database/models");

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
    return res.render("cart", {"userLogged":req.session.userLogged, "users":users});
  },
  order: async function (req, res) {
    let order = await db.Order.findByPk(req.params.id, {
      include: db.Order.OrderItems,
    });
   
    // res.send(order);
    return res.render("order", {order, "user": req.session.userLogged });
  },

  deleteOrder: async function (req, res) {
    try {
        const orderId = req.params.id; 

        // Aquí está la declaración de orderId, por lo que ahora se puede usar en el console.log
        console.log("Order ID to delete:", orderId);

        // Buscar el pedido por su ID
        const order = await db.Order.findByPk(orderId);
        if (!order) {
            console.log("Pedido no encontrado");
            return res.status(404).send("Pedido no encontrado");
        }

        // Eliminar el pedido
        await order.destroy();

        console.log("Pedido eliminado:", orderId);
        // Redireccionar a la lista de pedidos
        return res.redirect("/orders");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar el pedido");
    }
},


};
