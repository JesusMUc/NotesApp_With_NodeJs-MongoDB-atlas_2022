const passport = require("passport"); //nos ayuda a autenticar los usuarios
const LocalStrategy = require("passport-local").Strategy; //estrategia de autenticacion
const User = require("../models/Users");
//nueva estrategia de autenticacion
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      //buscamos en la base de datos
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "Not User Found" }); //termina el proceso de autenticacion
      } else {
        //verificacmos el password
        //cmo tom tiempo le pponemos el await
        const match = await user.matchPassword(password);
        if (match) {
          //la contraseña y usuario con correctos y lo devolvemos
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect Password" });
        }
      }
    }
  )
);
//para almacenarla  en una seccion
passport.serializeUser((user, done) => {
  done(null, user.id); //almacenamos la secion su id
});
//toma un id y genera un usuario
//si hay un usuario en la secion
passport.deserializeUser((id, done) => {
  //hcamos la busqueda por id el usuarii
  User.findById(id, (err, user) => {
    //si lo encuentro
    done(err, user);
  });
});
