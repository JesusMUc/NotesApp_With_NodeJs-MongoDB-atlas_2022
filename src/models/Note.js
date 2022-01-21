const mongoose = require("mongoose");
const { Schema } = mongoose; //solo queremos el squema
//propiedades de las notas que tendran
const NoteSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: String } //este user alacenara el id logueado
});
//creamos el modelos para ocuprlo fuera de este
module.exports = mongoose.model("Note", NoteSchema);
