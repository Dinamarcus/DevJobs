import Vacante from "../models/Vacante.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";

const formularioNuevaVacante = (req, res) => {
  res.render("nueva-vacante", {
    nombrePagina: "Nueva vacante",
    tagline: "Llena el formulario y publica tu vacante",
    cerrarSesion: true,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
    barra: false
  });
};

const agregarVacante = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    req.flash(
      "error",
      errores.array().map((error) => error.msg)
    );

    return res.render("nueva-vacante", {
      nombrePagina: "Edita tu perfil en DevJobs",
      cerrarSesion: true,
      mensajes: req.flash(),
    });
  }

  const vacante = new Vacante(req.body);

  // Usuario autor de la vacante
  vacante.autor = req.user._id;

  vacante.skills = req.body.skills.split(",");

  try {
    const nuevaVacante = await vacante.save();

    return res.redirect(`/vacantes/${nuevaVacante.url}`);
  } catch (error) {
    console.log(error);
  }
};

const mostrarVacante = async (req, res) => {
  //Corroborar si esta accediendo un usuario autenticado
  const usuario = req.user;

  const searchUser = await Usuario.findById(usuario?._id).lean();
  const autenticado = searchUser !== null ? true : false;

  const vacante = await Vacante.findOne({ url: req.params.url })
    .populate("autor") // Trae toda la información del autor
    .lean();

  if (!vacante) return next();

  return res.render("vacante", {
    vacante,
    nombrePagina: vacante.titulo,
    barra: false,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
    id: usuario?._id,
  });
};

const formEditarVacante = async (req, res, next) => {
  const vacante = await Vacante.findOne({ url: req.params.url }).lean();

  if (!vacante) return next();

  res.render("editar-vacante", {
    vacante,
    nombrePagina: `Editar - ${vacante.titulo}`,
    barra: false,
    cerrarSesion: true,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
    csrfToken: req.csrfToken
  });
};

const editarVacante = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    req.flash(
      "error",
      errores.array().map((error) => error.msg)
    );

    return res.redirect(`/vacantes/editar/${req.params.url}`);
  }

  const vacanteActualizada = req.body; 
  vacanteActualizada.skills = req.body.skills.split(",");

  const vacante = await Vacante.findOneAndUpdate(
    {
      url: req.params.url,
    },
    vacanteActualizada,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.redirect("/administracion");
};

const eliminarVacante = async (req, res) => {
  const { id } = req.params;

  try {
    const vacante = await Vacante.findById(id);

    if (!vacante) {
      return res.status(404).send("Vacante no encontrada");
    }

    if (verificarAutor(vacante, req.user)) {
      // Si este es el usuario, se puede eliminar
      await vacante.deleteOne();
      return res.status(200).send("Vacante eliminada correctamente");
    } else {
      // No permitido
      return res
        .status(403)
        .send("No tienes permiso para eliminar esta vacante");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error interno del servidor");
  }
};

const verificarAutor = (vacante = {}, usuario = {}) => {
  if (!vacante.autor.equals(usuario._id)) {
    return false;
  }
  return true;
};

const filePath = fileURLToPath(
  new URL("../public/uploads/cv", import.meta.url)
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
    if (file.mimetype === "application/pdf") {
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

// Sube un archivo en PDF
const subirCV = async (req, res, next) => {
  upload.single("cv")(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El archivo es muy grande: Máximo 2MB");
        } else {
          req.flash("error", error.message);
        }
      } else {
        req.flash("error", error.message);
      }

      res.redirect("back"); // Redireccionar a la misma página
      return;
    } else {
      return next();
    }
  });
};

// Almacena los candidatos en la base de datos
const contactar = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const vacante = await Vacante.findOne({ url: req.params.url })
      .populate("autor") // Trae toda la información del autor
      .lean();

    req.flash("error", errores.array().map((error) => error.msg))

    return res.redirect(`/vacantes/${vacante.url}`);
  }

  const vacante = await Vacante.findOne({
    url: req.params.url,
  });

  // Si no existe la vacante
  if (!vacante) return next();

  // Si todo es correcto, construir el nuevo objeto
  const nuevoCandidato = {
    nombre: req.body.nombre,
    email: req.body.email,
    cv: req.file?.filename,
  }; // Gracias a multer tenemos el atributo file dentro del objeto req

  // Almacenar la vacante
  vacante.candidatos.push(nuevoCandidato);
  await vacante.save();

  // Mensaje flash y redirección
  req.flash("correcto", "Se envió tu curriculum correctamente");

  res.redirect("/");
};

const mostrarCandidatos = async (req, res) => {
  const page = req.query.page || 1; // Asume la página 1 como predeterminada si no se proporciona
  const limit = 5; // Define cuántas vacantes quieres mostrar por página
  const skip = (page - 1) * limit; // Calcula cuántas vacantes saltar para la página actual (por ejemplo, 0 para la página 1, 5 para la página 2, etc.)

  const vacante = await Vacante.findById(req.params.id).lean();

  const totalPaginas = Math.ceil(vacante.candidatos.length / limit);

  if (vacante.autor.toString() !== req.user.id.toString()) {
    return next();
  } else if (!vacante) {
    return next();
  }

  res.render("candidatos", {
    nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
    cerrarSesion: true,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
    candidatos: vacante.candidatos.slice(skip, skip + limit),
    nroPaginas: totalPaginas,
    vacanteId: vacante._id.toString(),
  });
};

export {
  formularioNuevaVacante,
  agregarVacante,
  mostrarVacante,
  formEditarVacante,
  editarVacante,
  eliminarVacante,
  subirCV,
  contactar,
  mostrarCandidatos,
};
