import Express from "express";
import { body } from "express-validator";
import {
  mostrarTrabajos,
  vacantesFiltradas,
} from "../controllers/homeController.js";
import {
  formularioNuevaVacante,
  agregarVacante,
  mostrarVacante,
  formEditarVacante,
  editarVacante,
  eliminarVacante,
  subirCV,
  contactar,
  mostrarCandidatos,
} from "../controllers/vacanteController.js";
import {
  formCrearCuenta,
  crearUsuario,
  formIniciarSesion,
  formEditarPerfil,
  editarPerfil,
  subirImagen,
} from "../controllers/usuarioController.js";
import {
  autenticarUsuario,
  mostrarPanel,
  verificarUsuario,
  cerrarSesion,
  formReestablecerPassword,
  enviarToken,
  reestablecerPassword,
  guardarPassword,
} from "../controllers/authController.js";
import { csrfToken, calcularPaginas } from "../middlewares/middleware.js";
import Usuario from "../models/Usuario.js";

const Router = Express.Router();

Router.get("/", calcularPaginas, mostrarTrabajos);
Router.get("/vacantes/nueva", verificarUsuario, formularioNuevaVacante);
Router.post(
  "/vacantes/nueva",
  verificarUsuario,

  body("titulo").notEmpty().withMessage("El titulo es obligatorio").escape(),

  body("empresa").notEmpty().withMessage("La empresa es obligatoria").escape(),

  body("ubicacion")
    .notEmpty()
    .withMessage("La ubicacion es obligatoria")
    .escape(),

  body("salario").notEmpty().withMessage("El salario es obligatorio").escape(),

  body("contrato")
    .notEmpty()
    .withMessage("El contrato es obligatorio")
    .escape(),

  body("skills")
    .notEmpty()
    .withMessage("Las habilidades son obligatorias")
    .escape(),
  agregarVacante
);

Router.get("/vacantes/:url", mostrarVacante);

//Editar Vacante
Router.get("/vacantes/editar/:url", verificarUsuario, csrfToken, formEditarVacante);
Router.post("/vacantes/editar/:url", verificarUsuario,
  body("csrfToken").custom((value, { req }) => {
    const userTokens = new Map(Object.entries(req.session.userTokens || {}));

    if (!userTokens.get(req.sessionID).includes(value) || !value) {
      throw new Error("Token invalido");
    }
    return true;
  })
  ,csrfToken, editarVacante);

// Crear cuentas
Router.get("/crear-cuenta", formCrearCuenta);
Router.post(
  "/crear-cuenta",
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .trim()
    .escape(),
  body("email").isEmail().withMessage("Email no valido").trim().escape(),
  body("password")
    .notEmpty()
    .withMessage("El password no puede ir vacio")
    .trim()
    .escape(),
  body("confirmar")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Los passwords no coinciden");
      }
      return true;
    })
    .trim()
    .escape(),
  crearUsuario
);

// Eliminar vacantes
Router.delete("/vacantes/eliminar/:id", verificarUsuario, eliminarVacante);

// Autenticar usuarios
Router.get("/iniciar-sesion", formIniciarSesion);
Router.post("/iniciar-sesion", autenticarUsuario, async (req, res) => {
  global.userTokens.set(req.sessionID, req.user);
});

// Cerrar Sesion
Router.get("/cerrar-sesion", verificarUsuario, cerrarSesion);

// Resetear password
Router.get("/reestablecer-password", formReestablecerPassword);
Router.post("/reestablecer-password", enviarToken);

// Resetear password (Almacenar en la BD)
Router.get("/reestablecer-password/:token", reestablecerPassword);
Router.post("/reestablecer-password/:token", guardarPassword);

// Filtrar vacante
Router.post("/filter-search", vacantesFiltradas);

// Area privada
Router.get("/administracion", verificarUsuario, calcularPaginas, mostrarPanel);
Router.get("/editar-perfil", verificarUsuario, csrfToken, formEditarPerfil);
Router.post(
  "/editar-perfil",
  subirImagen,
  body("nombre")
    .notEmpty()
    .trim()
    .withMessage("El nombre no puede estar vacio")
    .escape(),
  body("email")
    .isEmail()
    .trim()
    .withMessage("Ingrese un email valido")
    .escape(),
  body("password").custom(async (value, { req }) => {
    if (value) {
      const user = await Usuario.findById(req.user.id);
      const isMatch = await user.compararPassword(value);

      if (!isMatch) {
        throw new Error("Password actual incorrecto");
      }
    }
    return true;
  }),
  body("nuevoPassword")
    .trim() // Primero, elimina los espacios en blanco al inicio y al final.
    .custom((value, { req }) => {
      if (value && !req.body.password) {
        throw new Error("Complete el password actual");
      }

      if (value == "" && req.body.password) {
        throw new Error("Complete el nuevo password");
      }

      return true;
    }),
  body("csrfToken").custom((value, { req }) => {
    const userTokens = new Map(Object.entries(req.session.userTokens || {}));

    if (!userTokens.get(req.sessionID).includes(value) || !value) {
      throw new Error("Token invalido");
    }
    return true;
  }),
  csrfToken,
  editarPerfil
);

// Recibir mensajes de candidatos
Router.post("/vacantes/:url",
  body("nombre").notEmpty().withMessage("El nombre es obligatorio").trim().escape(),
  body("email").isEmail().withMessage("Email no valido").trim().escape(),
  body("cv").custom((value, { req }) => {
    if (!value) {
      throw new Error("El CV es obligatorio");
    }
    return true;
  }),
  subirCV, 
  contactar
);

// Muestra los candidatos por vacante
Router.get("/candidatos/:id", verificarUsuario, mostrarCandidatos);

export default Router;
