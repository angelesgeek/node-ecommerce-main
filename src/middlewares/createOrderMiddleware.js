createOrderMiddleware = (req, res, next) => {
    if (!req.session.userLogged) {
        // Si el usuario no está logueado, redirige a la página de inicio.
        // Puedes agregar un mensaje aquí si lo deseas.
        return res.redirect("/");
    }

    const userRole = req.session.userLogged.rol;

    if (userRole === 1 || (userRole >= 20 && userRole <= 29) || (userRole >= 40 && userRole <= 50) || (userRole >= 0 && userRole <= 9)) {
        // El usuario tiene permiso para acceder a esta ruta.
        next();
    } else {
        // El usuario no tiene el rol adecuado, por lo que puedes redirigirlo o mostrar un mensaje.
        // Puedes personalizar el mensaje a tu gusto.
        return res.redirect("/"); // O mostrar un mensaje de error.
    }
};
module.exports = createOrderMiddleware;
