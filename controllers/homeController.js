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

const vacantesFiltradas = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const term = req.query.term || "";

  // Consulta para contar el total de registros que coinciden con el término de búsqueda
  const totalVacantes = await Vacante.countDocuments({
    titulo: { $regex: ".*" + term + ".*", $options: "i" },
  });

  // Consulta para obtener los registros paginados
  const vacantes = term === "" ?
    await Vacante.find().skip(skip).limit(limit).lean() :
    await Vacante.find({
      titulo: { $regex: ".*" + term + ".*", $options: "i" },
    }).skip(skip).limit(limit).lean();

  const nroPaginas = Math.ceil(totalVacantes / limit);

  if (!vacantes) return next();

  res.render("vacantes-filtradas", {
    nombrePagina: "Filtrado de Vacantes",
    vacantes,
    nroPaginas,
    paginaActual: page,
    termino: term,
  });
};
export { mostrarTrabajos, vacantesFiltradas };
