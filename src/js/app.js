import Swal from "sweetalert2";
import axios from "axios";

(function () {
  const skills = document.querySelector(".lista-conocimientos");
  const vacantesListado = document.querySelector(".panel-administracion");
  const selectedSkills = new Set();

  let alertas = document.querySelector(".alertas");

  if (alertas) {
    limpiarAlertas();
  }

  if (skills) {
    skills.addEventListener("click", agregarSkills);

    // Una vez que estamos en editar, llamar la función
    skillsSeleccionados();
  }

  if (vacantesListado) {
    vacantesListado.addEventListener("click", accionesListado);
  }

  function skillsSeleccionados() {
    const seleccionadas = Array.from(
      document.querySelectorAll(".lista-conocimientos .activo")
    );

    seleccionadas.forEach((seleccionada) => {
      selectedSkills.add(seleccionada.textContent);
    });

    const skillsArr = [...skills];
    document.querySelector("#skills").value = skillsArr;
  }

  function agregarSkills(e) {
    if (e.target.tagName === "LI") {
      if (e.target.classList.contains("activo")) {
        e.target.classList.remove("activo");
        selectedSkills.delete(e.target.textContent);
      } else {
        e.target.classList.add("activo");
        selectedSkills.add(e.target.textContent);
      }
    }

    document.querySelector("#skills").value = [...selectedSkills];
  }

  function skillsSeleccionados() {
    const seleccionadas = Array.from(
      document.querySelectorAll(".lista-conocimientos .activo")
    );

    seleccionadas.forEach((seleccionada) => {
      selectedSkills.add(seleccionada.textContent);
    });

    const skillsArr = [...selectedSkills];
    document.querySelector("#skills").value = skillsArr;
  }

  function limpiarAlertas() {
    const alertas = document.querySelector(".alertas");
    const interval = setInterval(() => {
      if (alertas.children.length > 0) {
        alertas.removeChild(alertas.children[0]);
      } else if (alertas.children.length === 0) {
        alertas.parentElement.removeChild(alertas);
        clearInterval(interval);
      }
    }, 800);
  }

  function accionesListado(e) {
    e.preventDefault();

    if (e.target.dataset.eliminar) {
      //Elimninar por medio de Axios
      Swal.fire({
        title: "Confirmar eliminacion?",
        text: "Una vez realizada la accion, no se recuperara la vacante!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // Enviar la petición con axios
          const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

          // Axios para eliminar el registro
          axios
            .delete(url, { params: { url } })
            .then((res) => {
              if (res.status === 200) {
                Swal.fire("Eliminado!", res.data, "success")
                  .then(() => {
                    // Eliminar del DOM
                    e.target.parentElement.parentElement.parentElement.remove();
                  })
                  .then(() => {
                    // Redireccionar al inicio
                    window.location.href = "/administracion";
                  });
              }
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "Hubo un error",
                text: "No se pudo eliminar",
              });
            });
        }
      });
    }

    if (e.target.href !== undefined) {
      window.location.href = e.target.href;
    }
  }

  const paginas = document.querySelectorAll(".nroPagina");
  if (paginas) {
    // Función para remover la clase 'paginaActual' de todas las páginas
    function removerClaseActual() {
      paginas.forEach((pagina) => {
        pagina.parentElement.classList.remove("paginaActual");
      });
    }

    // Función para añadir la clase 'paginaActual' basada en la URL
    function establecerPaginaActual() {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page') || '1'; // Asume 1 si 'page' no está presente

      paginas.forEach((pagina) => {
        if (pagina.textContent === page) {
          pagina.parentElement.classList.add("paginaActual");
        }
      });
    }

    // Inicialmente establece la página actual basada en la URL
    establecerPaginaActual();

    // Añade evento de clic para actualizar la clase 'paginaActual'
    paginas.forEach((pagina) => {
      pagina.addEventListener("click", () => {
        removerClaseActual();
        pagina.parentElement.classList.add("paginaActual");
      });
    });
  }

})();
