import mongoose from "mongoose";
import slug from "slug";
import shortid from "shortid";

mongoose.Promise = global.Promise;

const vacantesSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: "El nombre de la vacante es obligatorio",
    trim: true, // Elimina espacios en blanco al inicio y al final
  },
  empresa: {
    type: String,
    trim: true,
  },
  ubicacion: {
    type: String,
    trim: true,
    required: "La ubicación es obligatoria",
  },
  salario: {
    type: String,
    default: 0,
    trim: true,
  },
  contrato: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    lowercase: true,
  },
  autor: {
    type: mongoose.Schema.ObjectId,
    ref: "Usuario",
    required: "El autor es obligatorio",
  },
  skills: [String],
  candidatos: [
    {
      nombre: String,
      email: String,
      cv: String,
    },
  ],
});

// Antes de guardar en la DB
vacantesSchema.pre("save", function (next) {
  // Crear URL
  const url = slug(this.titulo);
  this.url = `${url}-${shortid.generate()}`;
  next();
}); // Middleware de Mongoose (pre, post) para ejecutar código antes o después de ciertas acciones

const Vacante = mongoose.model("Vacante", vacantesSchema);

export default Vacante;
