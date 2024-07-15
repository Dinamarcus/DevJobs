// Genera un json con datos de vacantes de prueba. Los campos son: titulo, empresa, descripcion, salario, contrato (que sean todos "Jornada Completa"), descripcion, skills (un array con tecnologias de desarrollo), candidatos (que es un array de objetos donde cada objeto tiene nombre e email. La direccion de correo que sea del formato correo@correo.com o similares), ubicacion, autor (contiene la referencia al usuario) y url (que es un slug del titulo). Luego, se exporta el json. Es importante que todas las vacantes sean distintas una de la otra.

const vacantes = [
  {
    "titulo": "Desarrollador Full Stack",
    "empresa": "Tech Innovations",
    "descripcion": "Buscamos un desarrollador Full Stack apasionado por la tecnología y el aprendizaje continuo.",
    "salario": "30000",
    "contrato": "Jornada Completa",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "candidatos": [
      {
        "nombre": "Juan Perez",
        "email": "juan.perez@correo.com"
      },
      {
        "nombre": "Ana Lopez",
        "email": "ana.lopez@correo.com"
      }
    ],
    "ubicacion": "Ciudad de México",
    "autor": {
      "email": "autor1@correo.com",
      "nombre": "Autor Uno"
    },
    "url": "desarrollador-full-stack"
  },
  {
    "titulo": "Ingeniero de Software",
    "empresa": "Global Code",
    "descripcion": "Ingeniero de software con experiencia en sistemas distribuidos y microservicios.",
    "salario": "35000",
    "contrato": "Jornada Completa",
    "skills": ["Java", "Spring Boot", "Kubernetes", "Docker"],
    "candidatos": [
      {
        "nombre": "Carlos Martínez",
        "email": "carlos.martinez@correo.com"
      },
      {
        "nombre": "Luisa Fernanda",
        "email": "luisa.fernanda@correo.com"
      }
    ],
    "ubicacion": "Remoto",
    "autor": {
      "email": "autor2@correo.com",
      "nombre": "Autor Dos"
    },
    "url": "ingeniero-de-software"
  },
  {
    "titulo": "Analista de Datos",
    "empresa": "Data Insights",
    "descripcion": "Analista de datos para transformar datos en información que impulse decisiones de negocio.",
    "salario": "28000",
    "contrato": "Jornada Completa",
    "skills": ["Python", "SQL", "Tableau", "Machine Learning"],
    "candidatos": [
      {
        "nombre": "Sofía Cruz",
        "email": "sofia.cruz@correo.com"
      },
      {
        "nombre": "Miguel Ángel",
        "email": "miguel.angel@correo.com"
      }
    ],
    "ubicacion": "Buenos Aires",
    "autor": {
      "email": "autor3@correo.com",
      "nombre": "Autor Tres"
    },
    "url": "analista-de-datos"
  },  
  {
    "titulo": "Ingeniero de Software Backend",
    "empresa": "Global Code",
    "descripcion": "En busca de un ingeniero de software backend con experiencia en microservicios y APIs REST.",
    "salario": "35000",
    "contrato": "Jornada Completa",
    "skills": ["Java", "Spring Boot", "MySQL", "Docker"],
    "candidatos": [
      {
        "nombre": "Carlos Martínez",
        "email": "carlos.martinez@correo.com"
      },
      {
        "nombre": "Sofía Gómez",
        "email": "sofia.gomez@correo.com"
      }
    ],
    "ubicacion": "Remoto",
    "autor": "UsuarioID",
    "url": "ingeniero-de-software-backend"
  },
  {
    "titulo": "Diseñador UX/UI",
    "empresa": "Creative Solutions",
    "descripcion": "Diseñador UX/UI creativo y con experiencia para unirse a nuestro equipo de diseño.",
    "salario": "28000",
    "contrato": "Jornada Completa",
    "skills": ["Figma", "Sketch", "Adobe XD", "Prototyping"],
    "candidatos": [
      {
        "nombre": "Laura Jimenez",
        "email": "laura.jimenez@correo.com"
      },
      {
        "nombre": "Miguel Ángel Torres",
        "email": "miguel.torres@correo.com"
      }
    ],
    "ubicacion": "Madrid, España",
    "autor": "UsuarioID",
    "url": "disenador-ux-ui"
  },
  {
    "titulo": "Desarrollador Frontend Senior",
    "empresa": "Innovatech",
    "descripcion": "Buscamos un desarrollador Frontend Senior con experiencia en React y manejo de estados globales.",
    "salario": "40000",
    "contrato": "Jornada Completa",
    "skills": ["React", "Redux", "CSS", "Webpack"],
    "candidatos": [
      {
        "nombre": "Ana Ruiz",
        "email": "ana.ruiz@correo.com"
      },
      {
        "nombre": "Jorge Sánchez",
        "email": "jorge.sanchez@correo.com"
      }
    ],
    "ubicacion": "Barcelona, España",
    "autor": "UsuarioID",
    "url": "desarrollador-frontend-senior"
  },
  {
    "titulo": "Analista de Datos",
    "empresa": "DataCorp",
    "descripcion": "Se requiere analista de datos para interpretar y analizar grandes volúmenes de datos.",
    "salario": "32000",
    "contrato": "Jornada Completa",
    "skills": ["Python", "SQL", "Tableau", "Machine Learning"],
    "candidatos": [],
    "ubicacion": "Remoto",
    "autor": "UsuarioID",
    "url": "analista-de-datos"
  },
  {
    "titulo": "Especialista en Seguridad Informática",
    "empresa": "SecureIT",
    "descripcion": "Experto en seguridad informática para proteger la infraestructura de TI contra ataques.",
    "salario": "45000",
    "contrato": "Jornada Completa",
    "skills": ["Ciberseguridad", "Firewalls", "Antivirus", "Criptografía"],
    "candidatos": [
      {
        "nombre": "Luisa Fernanda Pérez",
        "email": "luisa.perez@correo.com"
      }
    ],
    "ubicacion": "Valencia, España",
    "autor": "UsuarioID",
    "url": "especialista-en-seguridad-informatica"
  }
]

export default vacantes;