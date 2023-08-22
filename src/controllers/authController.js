const bcryptjs = require("bcryptjs");
const db = require("../database/models");
const { validationResult } = require("express-validator");

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
      
        return user.rol == 1 ? res.redirect("/orders") : res.redirect("/profile");
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
      return res.render("clientRegister", { errors: errors, olds: req.body, userLogged: req.session.userLogged });
    }
  
    var salt = bcryptjs.genSaltSync(10);
    var plainPassword = req.body.password;
    var password = bcryptjs.hashSync(req.body.password, salt);
  
    let data = {
      name: req.body.name,
      id_app: req.body.id_app ? req.body.id_app : null, // Verificamos si existe req.body.id_app
      email: req.body.email,
      rol: req.body.rol,
      password: password
    };
  
    // Guardar el usuario en la base de datos
    try {
      let newUser = await db.User.create(data);
  
      // Redirigimos al menú de usuario
      return res.redirect(`/users/`);
    } catch (error) {
      // Manejo de errores
      console.log(error);
      return res.status(500).send('Error al crear el usuario');
    }
  },
  logout: function (req, res) {
    req.session.destroy();
    res.clearCookie("userId");
    return res.redirect("/");
  },

  //editar perfil

  edit: async function (req, res) {
    console.log("userLogged 1"+ req.session.userLogged)
    if (!req.session.userLogged || !req.session.userLogged.rol==1) {
      
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

    if (!req.session.userLogged.rol==1) {
      return res.redirect("/users");
    }

    var salt = bcryptjs.genSaltSync(10),
        plainPassword = req.body.password,
        password = bcryptjs.hashSync( req.body.password, salt );

    let updatedUser = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      password: password
    }
    const [updaterows] = await db.User.update(updatedUser, {where: {id:req.body.id}});

          return res.redirect("/users");

    },
  delete: async function (req, res) {

    try{
    await db.User.destroy({
      where: { id: req.params.id },
    });
    return res.redirect("/users");
    }
    catch{
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

      let orders = await db.Order.findAll({
        where: { userId: userIdToView ? userToView.id : loggedInUser.id },
      });

      let totalSpent = orders.reduce((total, order) => total + order.total, 0);
      let numberOfOrders = orders.length;

      let messages = await db.Message.findAll({
        where: { userId: userIdToView ? userToView.id : loggedInUser.id }
      });

      return res.render("auth/profile", {
        userToView,
        loggedInUser,
        orders,
        messages,
        totalSpent,
        numberOfOrders,
        userLogged: loggedInUser, // Pasa "loggedInUser" como "userLogged" a la vista
      });

    } catch (error) {
      console.log(error);
      return res.redirect("/error");
    }
  },
};
module.exports = controller;
