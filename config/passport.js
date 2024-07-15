import passport from "passport";
import LocalStrategy from "passport-local";
import Usuario from "../models/Usuario.js";

const Passport = passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passportField: "password",
    },
    async (email, password, done) => {
      const usuario = await Usuario.findOne({ email });

      if (!usuario) {
        return done(null, false, { message: "Usuario no encontrado" });
      }

      const verifyPass = usuario.compararPassword(password);

      if (!verifyPass) {
        return done(null, false, { message: "Password incorrecto" });
      }

      // Usuario y password correcto
      return done(null, usuario);
    }
  )
);

Passport.serializeUser((usuario, done) => {
  done(null, usuario._id);
});

Passport.deserializeUser(async (id, done) => {
  const usuario = await Usuario.findById(id);

  return done(null, usuario);
});

export default Passport;
