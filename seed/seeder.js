import mongoose from "mongoose";
import readline from "readline";
import Usuario from "../models/Usuario.js";
import Vacante from "../models/Vacante.js";
import usuarios from "./usuarios.js";
import vacantes from "./vacantes.js";
import db from "../config/db.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const conectarDB = async () => {
  await db;
  console.log("Conexión a la base de datos establecida");
};

const importarUsuarios = async () => {
  await Usuario.bulkWrite(
    usuarios.map((usuario) => ({
      updateOne: {
        filter: { email: usuario.email },
        update: usuario,
        upsert: true,
      },
    }))
  );
  console.log("Usuarios insertados correctamente");
};

const importarVacantes = async (nombreUsuario) => {
  const usuario = await Usuario.findOne({ nombre: nombreUsuario });
  if (!usuario) {
    console.log("Usuario no encontrado");
    process.exit(1);
  }

  await Vacante.bulkWrite(
    vacantes.map((vacante) => ({
      updateOne: {
        filter: { titulo: vacante.titulo + Math.random() },
        update: { ...vacante, autor: usuario._id },
        upsert: true,
      },
    }))
  );
  console.log("Vacantes insertadas correctamente");
  process.exit(1);
};

const eliminarVacantes = async () => {
  await Vacante.deleteMany({});
  console.log("Vacantes eliminadas correctamente");
  process.exit(1);
};

const preguntarUsuario = () => {
  rl.question("\nPor favor ingresa el nombre del usuario: ", async (nombreUsuario) => {
    const usuarioEncontrado = usuarios.find((usuario) => usuario.nombre === nombreUsuario);

    if (!usuarioEncontrado) {
      console.log("Usuario no encontrado");
      rl.close();
      return;
    }

    await importarVacantes(nombreUsuario);
    rl.close();
  });
};

const ejecutarComando = async () => {
  await conectarDB();

  if (process.argv[2] === "-i") {
    await importarUsuarios();
    preguntarUsuario();
  } else if (process.argv[2] === "-e") {
    await eliminarVacantes();
  }
};

ejecutarComando();