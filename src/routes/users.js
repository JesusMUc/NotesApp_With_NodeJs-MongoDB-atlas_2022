const express = require("express");
const router = express.Router();
const User = require("../models/Users"); //modelo de datos
const passport = require("passport");

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});
//pra la autenticacion
router.post(
  "/users/signin",
  passport.authenticate("local", {
    successRedirect: "/notes", //por si todo sale bien
    failureRedirect: "/users/signin",
    failureFlash: true //mandarle mensajes flash
  })
); //loc<l es l autenticacion

router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

//a esta le mandamos el formulario
router.post("/users/signup", async (req, res) => {
  //console.log(req.body);
  const { name, email, password, confir_password } = req.body;
  const errors = [];
  if (name.length <= 0) {
    errors.push({ text: "Please Insert  your Name" });
  }
  if (password !== confir_password) {
    errors.push({ text: "Password do not match" });
  }
  if (password.length < 4) {
    errors.push({ text: "Passwort must be at least 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confir_password
    });
  } else {
    //para que no haya correos identicos
    const emailUser = await User.findOne({ email: email });
    //si hay repretido que cambie de correo
    if (emailUser) {
      console.log("Se repitio el correo: " + emailUser);
      req.flash("error_msg", "The email is Already in use ");

      res.redirect("/users/signup");
    } else {
      //instanciamos el modulo, creando un objeto de tipo new User
      const newUser = new User({ name, email, password });
      console.log("Nuevo usuario Agregado: " + newUser);
      //encriptamos la contraseñna con hash y lo actualizamos
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are Registered");
      res.redirect("/users/signin");
    }
  }
});

//salir de la apliacion
router.get("/users/logout", (req, res) => {
  req.logOut(); //terminar la secion
  res.redirect("/");
});

module.exports = router;
