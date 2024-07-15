import crypto from "crypto";
import Vacante from "../models/Vacante.js";

const csrfToken = async (req, res, next) => {
  if (req.user) {
    const token = crypto.randomBytes(20).toString("hex");

    // Inicializar req.session.userTokens como un objeto si no existe
    req.session.userTokens = {};

    // Verificar si ya existe un arreglo para este sessionID, si no, inicializarlo
    if (!req.session.userTokens[req.sessionID]) {
      req.session.userTokens[req.sessionID] = [];
    }

    // Verificar que no exista el token en el arreglo
    if (req.session.userTokens[req.sessionID].includes(token)) {
      return next();
    }

    // Agregar el token al arreglo asociado con req.sessionID
    req.session.userTokens[req.sessionID].push(token);

    req.csrfToken = token;
  }

  return next();
};

const calcularPaginas = async (req, res, next) => {
  try {
  const totalVacantes = await Vacante.countDocuments();
  const paginas = Math.ceil(totalVacantes / 5);

  req.paginas = paginas;

  return next();
  } catch (error) {
    console.log(error);
  }
}

export { csrfToken, calcularPaginas };
