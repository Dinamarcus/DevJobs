import emailConfig from "../config/email.js";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import hbs from "nodemailer-express-handlebars";
import util from "util"; // Convierte callbacks en promesas

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
}); // Configuración de Nodemailer para enviar correos

// Utilizar templates de Handlebars
transport.use(
  "compile",
  hbs({
    viewEngine: {
      extName: "handlebars",
      defaultLayout: false,
    },
    viewPath: __dirname + "/../views/emails",
    extName: ".handlebars", // se puede cambiar a .hbs tambien si se desea
  })
);

const enviarEmail = async (opciones) => {
  const opcionesEmail = {
    from: "devJobs <noreply@devjobs.com",
    to: opciones.usuario.email,
    subject: opciones.subject,
    template: opciones.archivo,
    context: {
      resetUrl: opciones.url,
    }, // Variables que se pasan al template
  };

  const sendMail = util.promisify(transport.sendMail, transport);

  return sendMail.call(transport, opcionesEmail);
};

export default enviarEmail;
