import Usuario from "../models/Usuario.js";
import { fileURLToPath } from "url";
import multer from "multer";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import fs from "fs";
import { csrfToken } from "../middlewares/middleware.js";

const formCrearCuenta = async (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/administracion");

  res.render("crear-cuenta", {
    nombrePagina: "Crea tu cuenta en DevJobs",
    tagline:
      "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
    autenticado: res.locals.autenticado,
    barra: false,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
  });
};

const crearUsuario = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    req.flash(
      "error",
      errores.array().map((error) => error.msg)
    );

    return res.render("crear-cuenta", {
      nombrePagina: "Crea tu cuenta en DevJobs",
      tagline:
        "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
      mensajes: req.flash(),
      usuario: req.user ? JSON.parse(JSON.stringify(req.user)) : {},
      barra: false,
    });
  }

  const usuario = new Usuario(req.body);

  try {
    const nuevoUsuario = await usuario.save();
    req.flash("correcto", "Usuario creado correctamente");
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/crear-cuenta");
  }
};

const formIniciarSesion = async (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/administracion");

  res.render("iniciar-sesion", {
    nombrePagina: "Iniciar Sesión DevJobs",
    autenticado: res.locals.autenticado,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
    barra: false,
  });
};

const formEditarPerfil = async (req, res) => {
  const token = req.csrfToken;

  console.log(req.session.userTokens);

  res.render("editar-perfil", {
    nombrePagina: "Edita tu perfil en DevJobs",
    usuario: JSON.parse(JSON.stringify(req.user)),
    cerrarSesion: true,
    autenticado: res.locals.autenticado,
    barra: false,
    csrfToken: token,
  });
};

const editarPerfil = async (req, res) => {
  const errores = validationResult(req);

  if (!req.user) {
    req.flash("error", "Operación no válida");
    return res.redirect("/iniciar-sesion");
  }

  if (!errores.isEmpty()) {
    req.flash(
      "error",
      errores.array().map((error) => error.msg)
    );

    return res.render("editar-perfil", {
      nombrePagina: "Edita tu perfil en DevJobs",
      usuario: JSON.parse(JSON.stringify(req.user)),
      cerrarSesion: true,
      mensajes: req.flash(),
      csrfToken: req.csrfToken,
    });
  }

  const { nombre, email, password, nuevoPassword } = req.body;

  req.user.nombre = nombre;
  req.user.email = email;

  // Asumiendo que ya has verificado que la contraseña actual (password) es correcta
  if (password.trim() != "" && nuevoPassword.trim() != "") {
    req.user.password = passwordNuevo; // Asegúrate de hashear la nueva contraseña antes de asignarla
  }

  if (req.file) {
    // Eliminar imagen anterior si existe
    if (req.user.imagen) {
      const pathImagen = filePath + "/" + req.user.imagen;
      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }
    }

    // Guardar la nueva imagen
    req.user.imagen = req.file.filename;
  }

  console.log("El nombre ha sido cambiado a " + req.user.nombre);
  console.log("El email ha sido cambiado a " + req.user.email);

  await req.user.save();

  req.flash("correcto", "Cambios guardados correctamente");

  res.redirect("/administracion");
};

const filePath = fileURLToPath(
  new URL("../public/uploads/perfiles", import.meta.url)
);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
  },
});

const configuracionMulter = {
  storage: fileStorage,
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Formato no válido"), false);
    }
  },
  limits: {
    fileSize: 2000000,
  },
};

const upload = multer(configuracionMulter); // nombre del campo del formulario que se va a subir

const subirImagen = async (req, res, next) => {
  upload.single("imagen")(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El archivo es muy grande: Máximo 100kb");
        } else {
          req.flash("error", error.message);
        }
      } else {
        req.flash("error", error.message);
      }

      res.redirect("/administracion");
      return;
    } else {
      return next();
    }
  });
};

export {
  formCrearCuenta,
  crearUsuario,
  formIniciarSesion,
  formEditarPerfil,
  editarPerfil,
  subirImagen,
  upload,
};
