import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import bcrypt from "bcrypt";

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  token: String,
  expira: Date,
  imagen: String,
  descripcion: String,
});

// Método para hashear los passwords
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  //Si no esta hasheado
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  return next();
});

// Enviar alerta cuando un usuario ya esta registrado
usuarioSchema.post("save", function (error, doc, next) {
  if (error.name.includes("MongoError") || error.name.includes("MongoServer")) {
    if (error.code === 11000) {
      return next("Ese correo ya esta registrado");
    } else {
      return next(error);
    }
  }
});

// Autenticar Usuarios
usuarioSchema.methods = {
  compararPassword: function (password) {
    return bcrypt.compareSync(password, this.password);
  },
}; // Se usa function en lugar de arrow function para poder acceder al this del objeto

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
