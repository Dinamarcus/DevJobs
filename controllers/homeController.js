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

const buscarVacantes = async (req, res, next) => {
  const { termino } = req.body; // Asegúrate de cambiar esto según tu implementación
  res.redirect(`/filter-search/?termino=${termino}`);
};

const renderVacantesFiltradas = async (req, res, next) => {
  const { termino } = req.query;
  const page = req.query.page || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  // Crear una expresión regular con el término de búsqueda
  // 'i' para ignorar mayúsculas/minúsculas
  const regex = new RegExp(termino, 'i');

  // Buscar vacantes que coincidan con el término en el campo deseado
  const vacantes = await Vacante.find({ titulo: regex })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalVacantes = await Vacante.countDocuments({ titulo: regex });
  const nroPaginas = Math.ceil(totalVacantes / limit);

  res.render("vacantes-filtradas", {
    tagline: `Resultados para la búsqueda: ${termino}`,
    barra: true,
    boton: false,
    vacantes,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
    vacantes,
    nroPaginas,
    termino
  });
};

export { mostrarTrabajos, renderVacantesFiltradas, buscarVacantes };
