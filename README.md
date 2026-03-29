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
* **Archivo de Mockups:** `MOCKUPS.pdf` (Documento PDF con el diseño de las interfaces). Ubicado de forma local en el directorio raíz del proyecto.
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
* Ubicación de la Base de Datos simulada: **Local**, en el archivo `db.json` alojado en la raíz del proyecto (simulando un "fake server" Json-Server / Strapi).

* **`inicio.html`**: 
  * *Responsive:* Hero banner apilado en móvil y reordenación Flexbox. Adaptable a Tablet (1024px) y Móvil (768px).
  * *Carga JSON:* Sí, carga título, sección de "Sobre nosotros", footer y productos dinámicamente desde el archivo `db.json`.
* **`servicios.html`**:
  * *Responsive:* CSS Grid (Desktop 3 columnas -> Tablet 2 columnas -> Móvil 1 columna).
  * *Carga JSON:* Sí, genera las tarjetas de los servicios de la clínica iterando la matriz contenida en el fichero JSON.
* **`equipo.html`**:
  * *Responsive:* Flex/Grid colapsable a 1 columna apilada en pantallas de móvil.
  * *Carga JSON:* Sí, carga dinámicamente los nombres, descripciones y fotografías de la plantilla médica actualizados del `db.json`.
* **`contacto.html` / Formulario Citas**:
  * *Responsive:* Layout horizontal de 2 columnas colapsable a 1 sola columna vertical apilada en tablet/móvil.
  * *Carga JSON:* Sí, extrae dinámicamente los horarios, datos de contacto (tel/email) y las direcciones de los mapas de Google Maps de forma local desde el JSON.
  * *Validaciones de Formulario (Nativas HTML5):* Uso sistemático del atributo `required` para control de envíos, entrada restringida de formato de mail mediante `type="email"`, forzado de selector de tiempos con `type="date"` y `type="time"`, además del uso avanzado de validación telefónica basada en expresiones regulares (`pattern="[0-9]{9}"`) validando prefijos españoles con mínimo requerido de tres dígitos mediante `minlength="3"`.
* **`login.html` / Inicio de Sesión / Registro**:
  * *Responsive:* Contenedor de ancho autoajustable al 95% para márgenes transpirables en terminales móviles pequeños, favoreciendo la legibilidad.
  * *Carga JSON:* Sí, valida el intento de autorización cruzando las credenciales formuladas por el usuario con el nodo de `usuarios` provisto internamente en el JSON para asignar la cookie de rol en sesión.
  * *Validaciones de Formulario (Nativas HTML5):* Obligatoriedad requerida mediante el uso de campos `required`, ofuscación visual de datos forzada con `type="password"`, entrada forzada de arrobas en `type="email"`, y longitud mínima de medidas de contraseñas blindada de parte del cliente a través de la propiedad `minlength="6"`.
  * **Usuarios y contraseñas de prueba creados:** 
    * Perfil Paciente: Email `paciente@web.com` / Contraseña `123456`
    * Perfil Sanitario (Enfermero): Email `enfermero@web.com` / Contraseña `1234567`
* **Perfil (`perfil.html`) y Citas (`citas.html`)**: 
  * *Responsive:* Tablas fluidas, redimensionables, y Grid flexible colpasando con auto-márgenes al 100% de la capa vista (viewport) en móviles.
  * *Carga JSON:* Sí, recuperan los datos específicos del usuario local (sesión) que el `fetch` cruzó en primer punto mediante parseo JSON. Modifica su apariencia según es detectado rol usuario o enfermero.
* **Productos de tienda (`cepillo_electrico.html`, `irrigador_bucal.html`, `kit_blanqueamiento.html`)**:
  * *Responsive:* Las divisiones de información y detalles colapsan reorganizando el bloque Flexbox. Reducción inteligente hacia una sola vertical protagonizada con imagen superior maximizada para su compra desde teléfono inteligente.
  * *Carga JSON:* Sí, todas las descripciones completas, así como los metadatos fotográficos e importes de inventario figuran guardados localmente listados en el fichero `db.json` cargándose asíncronamente vía scripts.

---

## 🧩 Arquitectura de Plantillas (Templates)
Para cumplir con el principio DRY (*Don't Repeat Yourself*) y optimizar el rendimiento, el proyecto aísla los componentes repetitivos en la carpeta `/templates/`:

1. **`templates/header.html`**: Contiene la barra de navegación superior. **Se carga en:** Todas las páginas principales (`index.html`, `contacto.html`, etc.).
2. **`templates/footer.html`**: Contiene los enlaces de pie de página. **Se carga en:** Todas las páginas principales.
3. **`templates/hero.html`**: Plantilla dinámica que genera la sección principal de cada página (Título, descripción, botón e imagen). **Se carga en:** `inicio.html`, `equipo.html`, `perfil.html`, `contacto.html`, `cepillo_electrico.html`, `irrigador_bucal.html` y `kit_blanqueamiento.html`. El contenido inyectado es único para cada página y se pasa a través de metadatos procesados en JS.
4. **`templates/products.html`**: Componente visual que muestra una cuadrícula (Grid) destacando 3 productos físicos que se venden en la clínica. **Se carga en:** Todas las páginas principales excepto en `login.html`.
5. **`templates/form.html`**: Plantilla reutilizable para estructurar los elementos de formulario indicando clases, la acción y renderizando campos dinámicamente (`slot`). **Se carga en:** `contacto.html` y `login.html`.

---

## 🚀 Otros Aspectos de Evaluación a Considerar

* **Ubicación del contenido JSON y Enfoque Flexible:** El fichero base (`db.json`) está alojado de manera **local** en la raíz del proyecto para simular la abstracción limpia de una base de datos externa. Esta información extraída se consume explícitamente a pulso sintiéndose orgánico sin intermediarios Frameworks utilizando Vanilla JS nativo mediante la potente API `fetch()`, lo cual deja estructuralmente la aplicación empaquetada y totalmente preparada para ser migrada su conexión (*Endpoint root pointer*) en un salto de línea sin el mayor coste con vistas en un despliegue completo de un Pseudo-servidor intermedio como son herramientas del tipo *JSON-Server* o Back-end *Strapi*. 
* **Renderización de Nodos y Componentes Web Modularizados mediante JS Puro:** A falta de frameworks del mercado, este entregable incluye escrito del propio teclado desde cero de un compilador de rutinas asíncronas (`xLuIncludeFile()`) implementada sobre los mimbres Vanilla utilizando recursividad a base de API de `Fetch` permitiendo al navegador cargar múltiples carpetas *templates* e insertarlas al mismo DOM simuláneamente de manera segura.
* **Arquitectura de Hojas de Estilo (CSS) y Look & Feel:**
  * **Metodología BEM (Block, Element, Modifier):** Se ha utilizado la nomenclatura estructural BEM para organizar las clases CSS.
  * Se han aplicado los conceptos de **CSS Grid Flexbox** en el 100% vital de los requerimientos para la alineación interna de componentes (Header, Hero layout), logrando el estándar propuesto de RWD.
  * Implementación limpia, pulida mediante transiciones con redondez perimetral de un mínimo de 8 píxeles en su diseño UI/UX.