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
* **Archivo de Mockups:** `MOCKUPS.pdf` (Documento PDF con el diseño de las interfaces).
* **Storyboard:** [Ver vídeo demostrativo de la navegación (OneDrive)](https://ulpgc-my.sharepoint.com/:f:/g/personal/daniela_melian102_alu_ulpgc_es/IgAEp6X6x1D7SayT0C3R1E-RAcBixE2dy0MqR7onQR3IyGk?e=rDSZto)
---

## 📄 Estructura de Páginas HTML
> **Página de inicio de la aplicación web:** `index.html` (y su versión navegable referenciada en el menú `pages/inicio.html`)

| Archivo HTML     | Nombre del Mockup que implementa | Descripción                                              |
|:-----------------| :--- |:---------------------------------------------------------|
| `index.html` / `pages/inicio.html` | Mockup_Inicio | Página principal con el resumen de la clínica.           |
| `pages/servicios.html` | Mockup_Servicios | Catálogo de tratamientos dentales ofrecidos.             |
| `pages/equipo.html`    | Mockup_Equipo | Presentación de los profesionales médicos.               |
| `pages/contacto.html`  | Mockup_Contacto | Formulario de contacto y datos de ubicación.             |
| `pages/perfil.html`    | Mockup_Perfil | Panel de control del paciente.                           |
| `pages/citas.html`     | Mockup_Citas | Interfaz para obtener información de citas.              |
| `pages/login.html`     | Mockup_Login | Página de inicio de sesión de usuario y registro.        |
| `pages/cepillo_electrico.html` | Mockup_Productos | Información detallada del producto: Cepillo Eléctrico.   |
| `pages/kit_blanqueamiento.html`| Mockup_Productos | Información detallada del producto: Kit Blanqueamiento.  |
| `pages/irrigador_bucal.html` | Mockup_Productos | Información detallada del producto: Irrigador Bucal.     |

### Detalles Técnicos por Página (Sprint 2)
* **`inicio.html`**: 
  * *Responsive:* Hero banner apilado en móvil y reordenación Flexbox. Adaptable a Tablet (1024px) y Móvil (768px).
  * *JSON:* Sí, carga título y sección "Sobre nosotros" dinámicamente.
* **`servicios.html`**:
  * *Responsive:* CSS Grid (Desktop 3 columnas -> Tablet 2 columnas -> Móvil 1 columna).
  * *JSON:* Sí, genera tarjetas de servicios iterando la matriz JSON.
* **`equipo.html`**:
  * *Responsive:* Flex/Grid colapsable a 1 columna en móvil.
  * *JSON:* Sí, carga datos y fotos de los especialistas.
* **`contacto.html`**:
  * *Responsive:* Layout de 2 columnas colapsa a 1 columna apilada de forma vertical en tablet/móvil.
  * *JSON:* Sí, carga datos de contacto (tel/email).
  * *Validaciones de Formulario (HTML5):* `required`, `type="email"`, `type="tel"` con `pattern="[0-9]{9}"`, `minlength="3"`, `type="date"`, `type="time"`.
* **`login.html`**:
  * *Responsive:* Contenedor de ancho adaptativo al 95% en terminales móviles.
  * *JSON:* Sí, valida las credenciales introducidas y asigna roles contra la lista `usuarios` del JSON.
  * *Validaciones de Formulario (HTML5):* `required`, `type="email"`, `type="password"`.
  * **Usuarios de Prueba:** 
    * Paciente: `paciente@web.com` / Contraseña: `123456`
    * Enfermero: `enfermero@web.com` / Contraseña: `1234567`
* **Perfil (`perfil.html`), Citas (`citas.html`) y Productos**: 
  * *Responsive:* Adaptación de Grid y Flexbox al 100% de ancho de pantalla en móvil. 
  * *JSON:* Perfil y Citas extraen e imprimen datos del estado de la sesión, derivado previamente de JSON.

---

## 🧩 Arquitectura de Plantillas (Templates)
Para cumplir con el principio DRY (*Don't Repeat Yourself*) y optimizar el rendimiento, el proyecto aísla los componentes repetitivos en la carpeta `/templates/`:

1. **`templates/header.html`**: Contiene la barra de navegación superior. **Se carga en:** Todas las páginas principales (`index.html`, `contacto.html`, etc.).
2. **`templates/footer.html`**: Contiene los enlaces de pie de página. **Se carga en:** Todas las páginas principales.
3. **`templates/hero.html`**: Plantilla dinámica que genera la sección principal de cada página (Título, descripción, botón e imagen). **Se carga en:** `inicio.html`, `equipo.html`, `perfil.html`, `contacto.html`, `cepillo_electrico.html`, `irrigador_bucal.html` y `kit_blanqueamiento.html`. El contenido inyectado es único para cada página y se pasa a través de atributos `data-title`, `data-text`, etc.
4. **`templates/products.html`**: Componente visual que muestra una cuadrícula (Grid) destacando 3 productos físicos que se venden en la clínica. **Se carga en:** Todas las páginas principales excepto en `login.html`.
5. **`templates/form.html`**: Plantilla reutilizable para estructurar los elementos de formulario indicando clases, la acción y renderizando campos dinámicamente (`slot`). **Se carga en:** `contacto.html` y `login.html`.
---

## 🚀 Otros Aspectos de Evaluación a Considerar

* **Ubicación del contenido JSON:** El fichero base (`db.json`) está alojado de manera **local** en la raíz del proyecto para simular la abstracción de una base de datos. Se consume mediante Vanilla JS (API `fetch`), lo cual deja la aplicación totalmente preparada para conectarse en el futuro a un pseudo-servidor (*JSON-Server*) o un backend como *Strapi* simplemente actualizando el endpoint de la ruta de acceso.
* **Motor de Plantillas con JavaScript (Vanilla JS):** Se ha implementado una función asíncrona (`xLuIncludeFile()`) utilizando la API `Fetch` para cargar los archivos HTML de la carpeta *templates* de forma dinámica. Se ha optimizado el código para inyectar los datos en el DOM de forma segura (usando `insertAdjacentHTML` para evitar errores de modificación de nodos padre) y permite recursividad para plantillas anidadas.
* **Arquitectura de Hojas de Estilo (CSS):**
  * **Metodología BEM (Block, Element, Modifier):** Se ha utilizado la nomenclatura estructural BEM para organizar las clases CSS, lo que asegura selectores directos, legibles y evita colisiones de estilos entre componentes.
  * Se han aplicado los conceptos de **CSS Grid** para la estructura general de las tarjetas y **Flexbox** para la alineación interna de componentes (Header, Hero layout), siguiendo las mejores prácticas actuales.
  * Uso de **Variables CSS (`:root`)** para mantener consistencia en la paleta de colores (`--negro-smile`, `--blanco`, `--gris-fondo`) y sombras, facilitando el mantenimiento.
  * *Separation of Concerns:* El código específico de cada sección se mantiene independiente de las plantillas globales utilizando el pseudo-selector `:not()` para evitar conflictos de cascada.
* **Look & Feel:** Diseño moderno, limpio y minimalista. Uso intensivo de espacios en blanco (paddings/margins consistentes), esquinas redondeadas (`border-radius`) y transiciones suaves (`transition: 0.3s ease`) en los hovers para mejorar la experiencia de usuario (UX).