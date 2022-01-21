const express = require("express");
const router = express.Router();
const Note = require("../models/Note"); //con este modelo podemos un crud de notas
const { isAuthenticated } = require("../helpers/auth"); //este nos ayuda a asegurar las rutas de que solo entren los autenticados

//esta es la manera mas censilla de autenticar las rutas
router.get("/notes/add", isAuthenticated, (req, res) => {
  res.render("notes/new-note");
});

//para recibir los datos en esta pagina
//agregar nueva nota
router.post("/notes/new-note", isAuthenticated, async (req, res) => {
  //console.log(req.body); //con esto recibimos los datos y le enviamos una rfespuesta
  const { title, description } = req.body;
  const errors = []; //para los mensajes de error
  // console.log("el titylo es " + title);
  if (title === "") {
    errors.push({ text: "Please Write a Title" });
  }
  if (description === "") {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0) {
    //si hay errores mostrar nuevamente la vista de noas
    //y le mandamos los errores
    res.render("notes/new-note", {
      errors,
      title,
      description
    });
  } else {
    //creamos un nuevo dato
    const newNote = new Note({ title, description });
    newNote.user = req.user.id; //con esto ya estamos guardando el id del usuario
    // console.log(newNote);
    //guardarlo en l base de mongoDB
    await newNote.save(); //el async indica que habra procesos asincronos
    //res.send("ok");
    //este flash es para los mensjes guardados de manera global
    req.flash("success_msg", "Nota Added Successfully");
    res.redirect("/notes"); //redirecciona
  }
});
//consulta todos los datos de la base de datos
//buscar datos es un proceso sincrono
router.get("/notes", isAuthenticated, async (req, res) => {
  //res.send("Notes from databases");
  //desde la coleccion note muestrame todos los datos
  // console.log("notes");
  //Note.find({user: req.user.id}) solo traera las notas de cada usuario logueado
  const notes = await Note.find({ user: req.user.id }).sort({ date: "desc" }); //fuardanos los datos//ordenador de manera descendente
  //console.log(notes);
  res.render("notes/all-Notes", { notes });
});
//obtenemos el id
router.get("/notes/edit/:id", isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id); //lo buscamos por id
  res.render("notes/edit-note", { note });
});

//funcionara tipo ajax Editar
router.put("/notes/edit-note/:id", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, {
    title,
    description
  }); //metodo busca id primero y luego actiualiza metodo asincrotno
  req.flash("success_msg", "Nota Updated Successfully");
  //redireccionamos a all note y mostrar todas
  res.redirect("/notes");
});

router.delete("/notes/delete/:id", isAuthenticated, async (req, res) => {
  //console.log(req.params.id);
  await Note.findByIdAndRemove(req.params.id);
  req.flash("success_msg", "Nota Deleted Successfully");
  res.redirect("/notes");
});

module.exports = router;
