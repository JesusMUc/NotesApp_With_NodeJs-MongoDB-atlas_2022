const helpers = {};
//para comprobar si esta autentitcado
helpers.isAuthenticated = (req, res, next) => {
  //metodo que checa si hay una autenticacion, revisa si existe una  vez logueado
  if (req.isAuthenticated()) {
    return next();
  } else {
    //por si no esta autorizado, tiene que loguearse
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/signin");
  }
};

module.exports = helpers;
