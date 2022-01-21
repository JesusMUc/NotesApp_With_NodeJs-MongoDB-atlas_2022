/* se creo el 11 de enero y lo terminamos el  18 de enero 2022 */

const express = require("express");
const path = require("path");
//const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash"); //enviar mensajes en multiples vistas
const passport = require("passport");
//inicializacion
const app = express();
require("./database");

require("./config/passport"); //para la autenticacion de usuario
//Settings
app.set("port", process.env.PORT || 8080);
app.set("views", path.join(__dirname, "views"));
//archivos de handlervars
//y su motor de plantillas //y le damos un objeto de configuracion
app.engine(
  ".hbs",
  exphbs.engine({
    //las maneras en que ocuparemos las vistas
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs"
  })
);

console.log(__dirname);
//utilizamos , pra configurar el motor de plantillas
app.set("view engine", ".hbs");

//middlewars
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
//autentica y guarda los valores por un tiempo
app.use(
  session({
    secret: "mysecretapp",
    resave: true,
    saveUninitialized: true
  })
);
//estos es para la secion y utentificacion
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); //para envir mensajes

//global variables
app.use((req, res, next) => {
  //para guardar los mensajes globales
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null; //con esto obtenemos los valores del usuario logueado y con esto generamos un sludo
  next();
});
//routes

app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));

//static files
app.use(express.static(path.join(__dirname, "public")));

//iniciar servidor
app.listen(app.get("port"), () => {
  console.log("Server on line:" + app.get("port"));
});
