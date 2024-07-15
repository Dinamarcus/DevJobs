const seleccionarSkills = (seleccionadas = [], opciones) => {
  const skills = [
    "HTML5",
    "CSS3",
    "CSSGrid",
    "Flexbox",
    "JavaScript",
    "jQuery",
    "Node",
    "Angular",
    "VueJS",
    "ReactJS",
    "React Hooks",
    "Redux",
    "Apollo",
    "GraphQL",
    "TypeScript",
    "PHP",
    "Laravel",
    "Symfony",
    "Python",
    "Django",
    "ORM",
    "Sequelize",
    "Mongoose",
    "SQL",
    "MVC",
    "SASS",
    "WordPress",
  ];

  let html = "";
  skills.forEach((skill) => {
    html += `
        <li ${
          seleccionadas.includes(skill) ? 'class="activo"' : ""
        }>${skill}</li>
        `;
  });

  return opciones.fn({ html }); // Retornar HTML con las opciones seleccionadas por el usuario
}; // El parametro opciones es un objeto que contiene una función llamada fn que es la que se encarga de retornar el HTML que se le pasa como argumento. En este caso, el HTML que se le pasa como argumento es el HTML que se genera en el forEach.

const tipoContrato = (seleccionado, opciones) => {
  return opciones
    .fn(this)
    .replace(new RegExp(`value="${seleccionado}"`), `$& selected="selected"`);
};

const mostrarAlertas = (errores = {}) => {
  const categoria = Object.keys(errores);
  
  let html = "";
  if (categoria.length) {
    errores[categoria].forEach((error) => {
      html += `<div class="${categoria} alerta">
          ${error}
        </div>`;
    });
  }
  return html;
};

const not = (value) => !value;

const isOwner = (vacante = {}, id) => {
  if (!vacante.autor._id.equals(id)) {
    return false;
  }
  return true;
};

const paginacionHelper = (numeroPaginas, indice) => {
  let html = "";

  for (let i = 1; i <= numeroPaginas; i++) {
    html += indice.fn(i);
  }

  return html;
};

export { seleccionarSkills, tipoContrato, mostrarAlertas, not, isOwner, paginacionHelper };
