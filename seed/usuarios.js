import bcrypt from "bcrypt";

const usuarios = [
  {
    nombre: "test2",
    email: "test2@test.com",
    password: bcrypt.hashSync("password", 10),
    descripcion: "Soy un usuario de prueba",
  },
  {
    nombre: "test3",
    email: "test3@test.com",
    password: bcrypt.hashSync("password", 10),
    descripcion: "Soy un usuario de prueba",
  },
  {
    nombre: "test4",
    email: "test4@test.com",
    password: bcrypt.hashSync("password", 10),
    descripcion: "Soy un usuario de prueba",
  },
];

export default usuarios;
