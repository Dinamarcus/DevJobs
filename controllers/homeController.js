import Vacante from "../models/Vacante.js";

const mostrarTrabajos = async (req, res, next) => {
  const page = req.query.page || 1; // Asume la página 1 como predeterminada si no se proporciona
  const limit = 5; // Define cuántas vacantes quieres mostrar por página
  const skip = (page - 1) * limit; // Calcula cuántas vacantes saltar para la página actual (por ejemplo, 0 para la página 1, 5 para la página 2, etc.)

  const vacantes = await Vacante.find().skip(skip).limit(limit).lean();

  if (!vacantes) return next();

  res.render("home", {
    nombrePagina: "Inicio",
    tagline: "Encuentra y Publica Trabajos para Desarrolladores web",
    barra: true,
    boton: true,
    vacantes,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
    nroPaginas: req.paginas,
    paginaActual: page,
  });
};

const vacantesFiltradas = async (req, res) => {
  const vacantes = await Vacante.find({
    titulo: { $regex: ".*" + req.body.term + ".*", $options: "i" },
  }).lean();

  res.render("vacantes-filtradas", {
    nombrePagina: "Filtrado de Vacantes",
    vacantes,
    barra: true,
    termino: req.body.term,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
  });
};

export { mostrarTrabajos, vacantesFiltradas };
