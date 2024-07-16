import passport from "passport";
import crypto from "crypto";
import Vacante from "../models/Vacante.js";
import Usuario from "../models/Usuario.js";
import enviarEmail from "../handlers/emailProd.js";

const autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/administracion",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});

const mostrarPanel = async (req, res) => {
  const page = req.query.page || 1; // Asume la página 1 como predeterminada si no se proporciona
  const limit = 5; // Define cuántas vacantes quieres mostrar por página
  const skip = (page - 1) * limit; // Calcula cuántas vacantes saltar para la página actual (por ejemplo, 0 para la página 1, 5 para la página 2, etc.)

  // Consultar el usuario autenticado
  const vacantes = await Vacante.find({
    autor: req.user._id,
  }).skip(skip).limit(limit).lean();

  if (!vacantes) return next();

  res.render("administracion", {
    nombrePagina: "Panel Administración",
    tagline: "Crea y Administra tus Vacantes desde aquí",
    vacantes,
    cerrarSesion: true,
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
    nroPaginas: req.paginas,
  });
};

const verificarUsuario = (req, res, next) => {
  // Revisar el usuario
  if (req.isAuthenticated()) {
    console.log("Session ID:", req.sessionID);
    return next(); // Están autenticados
  }

  // Redireccionar
  return res.redirect("/iniciar-sesion");
};

const cerrarSesion = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("correcto", "Cerraste sesión correctamente");
    return res.redirect("/iniciar-sesion");
  });
};

// Formulario para restablecer el password
const formReestablecerPassword = (req, res) => {
  res.render("reestablecer-password", {
    nombrePagina: "Reestablece tu Password",
    tagline:
      "Si ya tienes una cuenta pero olvidaste tu password, coloca tu email",
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
  });
};

// Genera el token en la tabla del usuario
const enviarToken = async (req, res) => {
  const usuario = await Usuario.findOne({
    email: req.body.email,
  });

  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    return res.redirect("/iniciar-sesion");
  }

  // El usuario existe, generar un token
  usuario.token = crypto.randomBytes(20).toString("hex"); //20 * 8 = 160 bits de longitud, 160/4 = 40 caracteres hexadecimales

  usuario.expira = Date.now() + 3600000; // 1 hora

  await usuario.save();
  const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

  const options = {
    asunto: "Password Reset",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: #fff; padding: 20px; margin: auto; max-width: 600px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #4f46e5; color: #ffffff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2>Reestableceer Contraseña</h2>
                </div>
                <div style="margin-top: 20px;">
                    <p>Hola, ${usuario.nombre}</p>
                    <p>Hemos recibido una solicitud para reestablecer tu contraseña. Si no has realizado esta solicitud, por favor ignora este correo. De lo contrario, haz clic en el enlace de abajo para establecer una nueva contraseña:</p>
                    <a href=${resetUrl} target="_blank" style="color: #007bff;">Reestablecer Contraseña</a>
                </div>
                <div style="background-color: #4f46e5; color: #ffffff; text-align: center; padding: 10px; border-radius: 0 0 8px 8px; margin-top: 20px;">
                    <p>Gracias por unirte a nosotros,</p>
                    <p>El Equipo de Nuestra Comunidad</p>
                </div>
            </div>
        </body>
      </html>
    `,
    remitente: {
      name: "noReply",
      email: "noReply@devJobs.com",
    },
    destinatario: {
      name: usuario.nombre,
      email: usuario.email,
    }
  }

  await enviarEmail(options);

  req.flash("correcto", "Revisa tu email para las indicaciones");
  res.redirect("/iniciar-sesion");
};

const reestablecerPassword = async (req, res) => {
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: {
      $gt: Date.now(), // $gt = greater than
    },
  });

  if (!usuario) {
    req.flash("error", "El formulario ya no es válido, intenta de nuevo");
    return res.redirect("/reestablecer-password");
  }

  // Todo bien, mostrar el formulario
  res.render("nuevo-password", {
    nombrePagina: "Nuevo Password",
    usuario: req.user ? JSON.parse(JSON.stringify(req.user || "{}")) : null,
  });
};

// Almacena el nuevo password en la BD
const guardarPassword = async (req, res) => {
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: {
      $gt: Date.now(), // $gt = greater than
    },
  }); // Si deja la pagina abierta mucho tiempo, el token expira

  if (!usuario) {
    req.flash("error", "El formulario ya no es válido, intenta de nuevo");
    return res.redirect("/reestablecer-password");
  }

  // Asignar nuevo password, limpiar valores previos
  usuario.password = req.body.password;
  usuario.token = undefined;
  usuario.expira = undefined;

  // Agregar y eliminar valores del objeto
  await usuario.save();

  req.flash("correcto", "Password Modificado Correctamente");
  res.redirect("/iniciar-sesion");
};

export {
  autenticarUsuario,
  mostrarPanel,
  verificarUsuario,
  cerrarSesion,
  formReestablecerPassword,
  enviarToken,
  reestablecerPassword,
  guardarPassword,
};
