const bcryptjs = require("bcryptjs");
const db = require("../database/models");
const { validationResult } = require("express-validator");

const controller = {
  showLogin: function (req, res) {
    return res.render("auth/login", { "user": req.session.userLogged });
  },
  login: async function (req, res) {
    //validar los datos
    let errores = validationResult(req);

    //si hay errores, retornarlos a la vista
    if (!errores.isEmpty()) {
      let errors = errores.mapped();
      console.log(errors);
      return res.render("auth/login", { errors: errors, olds: req.body, "user": req.session.userLogged });
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

        return user.admin ? res.redirect("/orders") : res.redirect("/profile");
      } else {
        //si la password no es correcta devolvemos el error
        return res.render("auth/login", {
          errors: {
            password: {
              msg: "La contraseña no es válida.",
            },
          },
          olds: req.body,
          "user": req.session.userLogged
        });
      }
    } else {
      return res.render("auth/login", {
        errors: { email: { msg: "No se encontró el usuario", olds: req.body, "user": req.session.userLogged } },
      });
    }
  },
  showRegister: function (req, res) {
    return res.render("auth/register", {"user": req.session.userLogged});
  },
  register: async function (req, res) {
    //validar los datos
    let errores = validationResult(req);

    //si hay errores, retornarlos a la vista
    if (!errores.isEmpty()) {
      let errors = errores.mapped();
      console.log(errors);
      return res.render("register", {errors: errors, olds: req.body, "user": req.session.userLogged});
    }

    let data = {
      name: req.body.name,
      email: req.body.email,
      password: bcryptjs.hashSync(req.body.password, 10),
      id_app: req.body.id_app,
    };
    //guarda el usuario en base de datos
    let newUser = await db.User.create(data);

    //redirigimos a menu de usuario
    return res.redirect(`/users/`);
  },
  
  logout: function (req, res) {
    req.session.destroy();
    res.clearCookie("userId");
    return res.redirect("/");
  },
  profile: async function (req, res) {
    let orders = await db.Order.findAll({
      where: { userId: req.session.userLogged.id },
    });

    let messages = await db.Mensaje.findAll();

    // return res.send(orders);
    return res.render("auth/profile", { "orders": orders, "messages": messages, "user": req.session.userLogged });
  },

};



module.exports = controller;
