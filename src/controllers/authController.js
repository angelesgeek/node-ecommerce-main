const bcryptjs = require("bcryptjs");
const db = require("../database/models");
const { validationResult } = require("express-validator");
let modoDeMantenimientoActivado = false;

const controller = {
  showLogin: function (req, res) {
    return res.render("auth/login", { "userLogged": req.session.userLogged });
  },

  login: async function (req, res) {

    //validar los datos
    let errores = validationResult(req);

    //si hay errores, retornarlos a la vista
    if (!errores.isEmpty()) {

      let errors = errores.mapped();

      console.log(errors);

      return res.render("auth/login", { errors: errors, olds: req.body, "userLogged": req.session.userLogged });

    }

    //leo el json
    let user = await db.User.findOne({

      where: {

        email: req.body.email,

      },

    });

    //buscar al usuario
    if (user) {

      let passOk = bcryptjs.compareSync(req.body.password, user.password);

      if (passOk) {

        //si la password es correcta se guarda el usuario en session
        req.session.userLogged = user;
        req.session.lastActitity = Date.now();

        //si recordar usuario esta activado enviamos una cookie con el email
        if (req.body.rememberMe) {

          res.cookie("userId", user.id, { maxAge: 1000 * 60 * 5 });

        }

        //redirigimos al menu de usuario
        return user.rol == 1 ? res.redirect("/orders") : res.redirect("/profile/" + req.session.userLogged.id);

      } else {

        //si la password no es correcta devolvemos el error
        return res.render("auth/login", {

          errors: {

            password: {

              msg: "La contraseña no es válida.",

            },

          },

          olds: req.body,
          "userLogged": req.session.userLogged

        });

      }

    } else {

      return res.render("auth/login", {

        errors: { email: { msg: "No se encontró el usuario", olds: req.body, "userLogged": req.session.userLogged } },

      });

    }

  },

  showRegister: function (req, res) {

    if (req.query.type === "admin") {

      // Si el enlace contiene el parámetro "type=admin", mostrar formulario para registrar vendedores y otros administradores
      return res.render("auth/adminRegister", { "userLogged": req.session.userLogged });

    } else if (req.query.type === "vendor") {

      // Si el enlace contiene el parámetro "type=vendor", mostrar formulario para registrar vendedores
      return res.render("auth/vendorRegister", { "userLogged": req.session.userLogged });

    } else {

      // Por defecto, mostrar formulario para registrar clientes
      return res.render("auth/clientRegister", { "userLogged": req.session.userLogged });

    }

  },

  register: async function (req, res) {

    // Validar los datos
    let errores = validationResult(req);

    // Si hay errores, retornarlos a la vista
    if (!errores.isEmpty()) {

      let errors = errores.mapped();
      console.log(errors);

      // Asegúrate de verificar el tipo y renderizar la vista correcta según el tipo
      if (req.body.rol === "admin") {

        return res.render("auth/adminRegister", { errors: errors, olds: req.body, userLogged: req.session.userLogged });

      } else if (req.body.rol === "vendor") {

        return res.render("auth/vendorRegister", { errors: errors, olds: req.body, userLogged: req.session.userLogged });

      } else {

        return res.render("auth/clientRegister", { errors: errors, olds: req.body, userLogged: req.session.userLogged });

      }

    }

    var salt = bcryptjs.genSaltSync(10);
    var plainPassword = req.body.password;
    var password = bcryptjs.hashSync(req.body.password, salt);

    let data = {

      name: req.body.name,
      id_app: req.body.id_app ? req.body.id_app : null,
      email: req.body.email,
      rol: req.body.rol,
      password: password,

    };

    // Guardar el usuario en la base de datos
    try {

      let newUser = await db.User.create(data);

      // Redirigimos según el tipo de usuario creado
      if (req.body.rol === 1) {

        return res.redirect(`/users/admin/`);

      } else if (req.body.rol >= 10 && req.body.rol <= 40) {

        return res.redirect(`/users/vendors/`);

      } else {

        return res.redirect(`/users/clients/`);
      }

    } catch (error) {

      // Manejo de errores
      console.log(error);
      return res.status(500).send("Error al crear el usuario");

    }
  },

  logout: function (req, res) {

    req.session.destroy();
    res.clearCookie("userId");
    return res.redirect("/");

  },

  edit: async function (req, res) {

    console.log("userLogged 1" + req.session.userLogged)
    if (!req.session.userLogged || !req.session.userLogged.rol == 1) {

      return res.redirect("/profile");

    }

    let user = await db.User.findByPk(req.params.id);

    if (user) {

      return res.render("auth/editUser", {

        user: user,
        userLogged: req.session.userLogged,

      });

    }

    return res.redirect("/users");

  },

  update: async function (req, res) {

    if (!req.session.userLogged.rol == 1) {

      return res.redirect(`/profile/${req.body.id}`);

    }

    var salt =

      bcryptjs.genSaltSync(10),
      plainPassword = req.body.password,
      password = bcryptjs.hashSync(req.body.password, salt);

    let updatedUser = {

      id: req.body.id,
      name: req.body.name,
      rol: req.body.rol,
      email: req.body.email,
      password: password

    }

    const [updaterows] = await db.User.update(updatedUser, { where: { id: req.body.id } });

    return res.redirect(`/profile/${req.body.id}`);

  },

  delete: async function (req, res) {
    try {
      const user = await db.User.findByPk(req.params.id);

      if (!user) {


        return res.redirect("/users");
      }

      const roleId = user.rol;

      await db.User.destroy({
        where: { id: req.params.id },
      });

      // Ahora, redirige al usuario según el rol del usuario eliminado
      if (roleId === 1) {

        return res.redirect("/users/admin/");

      } else if (roleId >= 10 && roleId <= 40) {

        return res.redirect("/users/vendors/");

      } else {

        return res.redirect("/users/clients/");

      }

    } catch (error) {
      console.error(error);
      return res.redirect("/error");
    }


  },

  profile: async function (req, res) {

    const loggedInUser = req.session.userLogged;
    const userIdToView = req.params.userId;

    try {

      let userToView;

      if (userIdToView) {

        userToView = await db.User.findByPk(userIdToView);
        if (!userToView) {
          return res.redirect("/users");

        }

      }


      const loggedInUserOrders = await db.Order.findAll({

        where: { userId: loggedInUser.id }

      });


      let userToViewOrders = [];

      if (userToView) {

        if (userToView.id_app === null) {

          userToViewOrders = await db.Order.findAll({

            where: { userId: userToView.id }

          });

        } else {

          userToViewOrders = await db.Order.findAll({
            where: { id_app: userToView.id_app }

          });

        }

      }

      const loggedInUserFilteredOrders = loggedInUserOrders.filter((order) => {

        return (
          order.id_app === null ||
          (userToView && userToView.id_app === order.id_app)

        );

      });

      const combinedOrders = [...loggedInUserFilteredOrders, ...userToViewOrders];

      const uniqueOrders = combinedOrders.filter((order, index, self) => {

        return (

          index ===
          self.findIndex((o) => o.id === order.id && o.id_app === order.id_app)

        );

      });

      const totalSpent = userToViewOrders.reduce(

        (total, order) => total + order.total,
        0

      );

      const numberOfOrders = userToViewOrders.length;

      let messages = await db.Message.findAll({

        where: { userId: userIdToView ? userToView.id : loggedInUser.id }

      });

      return res.render("auth/profile", {

        userToView,
        loggedInUser,
        orders: uniqueOrders,
        messages,
        totalSpent,
        numberOfOrders,
        userLogged: loggedInUser,

      });

    } catch (error) {

      console.log(error);
      return res.redirect("/error");

    }

  },

  activateMaintenance: function (req, res) {
    global.modoDeMantenimientoActivado = true;
    console.log("Modo de mantenimiento activado");
    return res.render("maintenanceMode.ejs", { userLogged: req.session.userLogged });
  },


  deactivateMaintenanceMode: function (req, res) {
    console.log("Desactivando el modo de mantenimiento");
    global.modoDeMantenimientoActivado = false;

    res.redirect("/");
  },

};

module.exports = controller;
