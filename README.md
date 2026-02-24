# 🦷 SmileLab - Sistema de Gestión Web para Clínica Dental

## 👥 Componentes del Grupo
* **Daniela Melián Salem**
* **Oscar Segura Guerrero**
* **Giuseppe Aniello**

---

## 📝 Descripción del Proyecto
SmileLab es una aplicación web diseñada para la gestión de una clínica dental. El proyecto ofrece una interfaz intuitiva para que los pacientes puedan conocer los servicios, el equipo médico, solicitar citas, gestionar su perfil de usuario y contactar con la clínica. 

## 🎯 Listado de Requisitos Funcionales
* El sistema debe proporcionar un formulario de contacto específico que permita a cualquier usuario solicitar una cita. El formulario solicitará: nombre, teléfono, email y motivo de la consulta. Al enviarlo, el sistema registrará la solicitud o enviará un aviso a la clínica.
* El sistema dispondrá de un "Área de Cliente" con acceso restringido (usuario y contraseña). Una vez autenticado, el usuario podrá visualizar una agenda o listado con sus próximas citas confirmadas, incluyendo fecha, hora y tipo de tratamiento
* El sistema mostrará una sección informativa ("Quiénes somos" o "Equipo") donde se presentarán los perfiles de los profesionales de la clínica, incluyendo fotografía, nombre y especialidad.
* El sistema ofrecerá un catálogo organizado donde los usuarios podrán consultar los diferentes tratamientos dentales que ofrece la clínica, con una breve descripción de cada uno.
* El sistema mostrará de forma clara la ubicación física de la clínica, integrando preferiblemente un mapa interactivo (Google Maps) y las instrucciones de cómo llegar.
* El sistema debe hacer énfasis visual en una sección de "Tienda" o productos destacados. Esta sección mostrará artículos relacionados con la salud dental que la clínica promociona o vende.

## 🎨 Diseño y Planificación
* **Archivo de Mockups y Storyboard:** `[ruta/del/archivo/Mockups_SmileLab.pdf]`
---

## 📄 Estructura de Páginas HTML
> **Página de inicio de la aplicación web:** `index.html`

| Archivo HTML     | Nombre del Mockup que implementa | Descripción                                              |
|:-----------------| :--- |:---------------------------------------------------------|
| `index.html`     | Mockup_Inicio | Página principal con el resumen de la clínica.           |
| `servicios.html` | Mockup_Servicios | Catálogo de tratamientos dentales ofrecidos.             |
| `equipo.html`    | Mockup_Equipo | Presentación de los profesionales médicos.               |
| `contacto.html`  | Mockup_Contacto | Formulario de contacto y datos de ubicación.             |
| `perfil.html`    | Mockup_Perfil | Panel de control del paciente.                           |
| `citas.html`     | Mockup_Citas | Interfaz para obtener información de citas.              |
| `producto.html`  | Mockup_Productos | Información de un producto.                              |

---

## 🧩 Arquitectura de Plantillas (Templates)
Para cumplir con el principio DRY (*Don't Repeat Yourself*) y optimizar el rendimiento, el proyecto aísla los componentes repetitivos en la carpeta `/templates/`:

1. **`templates/header.html`**: Contiene la barra de navegación superior. **Se carga en:** Todas las páginas principales (`index.html`, `contacto.html`, etc.).
2. **`templates/footer.html`**: Contiene los enlaces de pie de página. **Se carga en:** Todas las páginas principales.
3. **`templates/hero.html`**: Plantilla dinámica que genera la sección principal de cada página (Título, descripción, botón e imagen). **Se carga en:** `inicio.html`, `equipo.html`, `perfil.html`, `contacto.html`, etc. El contenido inyectado es único para cada página y se pasa a través de atributos `data-title`, `data-text`, etc.
4. **`templates/products.html`**: Componente visual que muestra una cuadrícula (Grid) destacando 3 productos físicos que se venden en la clínica. **Se carga en:** La página principal (`index.html`/`inicio.html`) y en la sección dedicada a productos (`producto.html`).
---

## 🚀 Otros Aspectos de Evaluación a Considerar

* **Motor de Plantillas con JavaScript (Vanilla JS):** Se ha implementado una función asíncrona (`xLuIncludeFile()`) utilizando la API `Fetch` para cargar los archivos HTML de la carpeta *templates* de forma dinámica. Se ha optimizado el código para inyectar los datos en el DOM de forma segura (usando `insertAdjacentHTML` para evitar errores de modificación de nodos padre) y permite recursividad para plantillas anidadas.
* **Arquitectura de Hojas de Estilo (CSS):**
  * Se han aplicado los conceptos de **CSS Grid** para la estructura general de las tarjetas y **Flexbox** para la alineación interna de componentes (Header, Hero layout), siguiendo las mejores prácticas actuales.
  * Uso de **Variables CSS (`:root`)** para mantener consistencia en la paleta de colores (`--negro-smile`, `--blanco`, `--gris-fondo`) y sombras, facilitando el mantenimiento.
  * *Separation of Concerns:* El código específico de cada sección se mantiene independiente de las plantillas globales utilizando el pseudo-selector `:not()` para evitar conflictos de cascada.
* **Look & Feel:** Diseño moderno, limpio y minimalista. Uso intensivo de espacios en blanco (paddings/margins consistentes), esquinas redondeadas (`border-radius`) y transiciones suaves (`transition: 0.3s ease`) en los hovers para mejorar la experiencia de usuario (UX).