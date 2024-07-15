import Express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import expHbs from "express-handlebars";
import index from "./routes/index.js";
import db from "./config/db.js";
import {
  seleccionarSkills,
  tipoContrato,
  mostrarAlertas,
  not,
  isOwner,
  paginacionHelper,
} from "./helpers/handlebars.js";
import bodyParser from "body-parser";
import flash from "connect-flash";
import Passport from "./config/passport.js";

dotenv.config();

const app = Express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine(
  "handlebars",
  expHbs.engine({
    defaultLayout: "layout", // Definir layout principal
    helpers: { seleccionarSkills, tipoContrato, mostrarAlertas, not, isOwner, paginacionHelper }, // Definir helpers
  })
);

// Conectar DB
try {
  await db;
} catch (e) {
  console.log(e);
}

app.set("view engine", "handlebars"); // Definir template engine
app.set("views", "./views"); // Definir directorio de vistas

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false, // No guardar sesión si no hay cambios
    saveUninitialized: false, // No guardar sesión si no se inicializa
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }), // Guardar sesión en DB
    cookie: {
      secure: false,
    },
  })
);

// Inicializar Passport
app.use(Passport.initialize());
app.use(Passport.session());

// Alertas y flash msgs
app.use(flash());

// Crear middleware para mensajes
app.use((req, res, next) => {
  res.locals.mensajes = req.flash(); //Siempre que haya un problema y por ende un mensaje que enviar, se guardará en res.locals.mensajes

  next();
});

app.use((req, res, next) => {
  res.locals.autenticado = req.isAuthenticated();
  next();
});

app.use("/", index);

app.use(Express.static(path.join(__dirname, "public"))); // Definir directorio de archivos estáticos (CSS, JS, Imágenes)
app.use(cookieParser());

// Definir Puerto
const PORT = process.env.PORT || 5000;

// Arrancar proyecto
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
