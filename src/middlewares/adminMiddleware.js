const { or } = require("sequelize");

adminMiddleware = (req, res, next) => {
    if (!req.session.userLogged  || !req.session.userLogged.admin) {
        //acá guardar mensaje que advierta que no se puede entrar a esta ruta en sesión
      return res.redirect("/");
    }
  
    next();
  };
  
  module.exports = adminMiddleware;
  