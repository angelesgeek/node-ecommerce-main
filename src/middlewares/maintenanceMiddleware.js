const app = require('../app');

const maintenanceMiddleware = (req, res, next) => {
  if (global.modoDeMantenimientoActivado) {
    
    // Si el modo de mantenimiento está activado, muestra la vista de mantenimiento.
    return res.render("maintenanceMode.ejs", { userLogged: req.session.userLogged });
  }

  // Si no está en modo de mantenimiento, permite que la solicitud continúe normalmente.
  next();
};

module.exports = maintenanceMiddleware;