# 🦷 SmileLab - Sistema de Gestión Web para Clínica Dental

## 👥 Componentes del Grupo

* **Daniela Melián Salem**
* **Oscar Segura Guerrero**
* **Giuseppe Aniello**

---

## 📝 Descripción del Proyecto

SmileLab es una aplicación web diseñada para la gestión de una clínica dental. El proyecto ofrece una interfaz intuitiva para que los pacientes puedan conocer los servicios de la clínica, consultar el equipo médico, revisar productos destacados, solicitar citas, gestionar su perfil de usuario y contactar con la clínica.

En el Sprint 3, el proyecto se ha migrado a **Angular**, transformando la web en una aplicación estructurada mediante componentes, rutas y servicios. Además, se ha integrado **Firebase** como backend para gestionar autenticación de usuarios, base de datos en tiempo real y almacenamiento de imágenes.

---

## 🎯 Listado de Requisitos Funcionales

* El sistema debe proporcionar un formulario de contacto que permita a cualquier usuario solicitar una cita.
* El sistema debe disponer de un área de cliente con acceso restringido mediante usuario y contraseña.
* El usuario autenticado podrá visualizar información asociada a su perfil y sus citas.
* El sistema mostrará una sección informativa del equipo médico de la clínica.
* El sistema ofrecerá un catálogo organizado de tratamientos dentales.
* El sistema mostrará productos destacados relacionados con la salud dental.
* El sistema permitirá diferenciar contenido según el usuario autenticado y su rol.
* El sistema permitirá crear nuevos productos desde un panel de administración.
* El sistema permitirá subir imágenes a Firebase Storage y almacenar su URL en Firebase Realtime Database.
* La aplicación debe mantener un diseño responsive adaptable a distintos tamaños de pantalla.

---

## 🎨 Diseño y Planificación

* **Archivo de Mockups:** `MOCKUPS.pdf`, ubicado de forma local en el directorio raíz del proyecto.
* **Storyboard:** [Ver vídeo demostrativo de la navegación (OneDrive)](https://ulpgc-my.sharepoint.com/:f:/g/personal/daniela_melian102_alu_ulpgc_es/IgAEp6X6x1D7SayT0C3R1E-RAcBixE2dy0MqR7onQR3IyGk?e=rDSZto)

---

## 🧱 Estructura del código del proyecto web

El proyecto del Sprint 3 se ha desarrollado con Angular, organizando la aplicación en componentes, servicios, rutas y guards. La estructura principal se encuentra dentro de:

```text
SmileLab-Angular/src/app
```

Estructura general:

```text
src/app/
├── app.config.ts
├── app.routes.ts
├── app.html
├── app.ts
├── core/
│   ├── data.service.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   └── services/
│       ├── data.ts
│       └── data-fallback/
├── pages/
│   ├── inicio/
│   ├── equipo/
│   ├── servicios/
│   ├── productos/
│   ├── contacto/
│   ├── login/
│   ├── registro/
│   ├── perfil/
│   ├── citas/
│   └── admin-crear-producto/
└── shared/
    ├── header/
    ├── footer/
    └── products-grid/
```

---

## 🧩 Componentes principales

### `app`

Es el componente raíz de la aplicación. Define la estructura general del sitio mediante:

* `app-header`: cabecera común.
* `router-outlet`: zona donde Angular carga cada página según la ruta activa.
* `app-products-grid`: bloque reutilizable de productos.
* `app-footer`: pie de página común.

Desde este componente se organiza la composición general de la aplicación y se sustituyen las antiguas plantillas HTML del Sprint 2 por componentes Angular reutilizables.

---

## 🔁 Componentes compartidos

### `shared/header`

Componente reutilizable para la cabecera de la web. Contiene la navegación principal mediante `routerLink`, sustituyendo el sistema anterior basado en enlaces con `#`.

Permite navegar entre las rutas principales de la aplicación:

* Inicio
* Equipo
* Servicios
* Productos
* Contacto
* Login
* Perfil
* Citas
* Panel de administración

### `shared/footer`

Componente reutilizable para el pie de página. Se muestra de forma común en las páginas principales de la aplicación.

### `shared/products-grid`

Componente encargado de mostrar productos destacados mediante tarjetas. Obtiene los datos desde el servicio correspondiente y permite reutilizar el bloque de productos en distintas zonas del sitio.

---

## 📄 Componentes de páginas

### `pages/inicio`

Página principal de la aplicación. Muestra el hero inicial, una sección de presentación de la clínica y servicios destacados. Su contenido se carga dinámicamente mediante los servicios de datos.

### `pages/equipo`

Página dedicada al equipo profesional de la clínica. Renderiza información de los miembros del equipo, incluyendo nombre, especialidad, descripción e imagen.

### `pages/servicios`

Página donde se muestran los tratamientos dentales disponibles. Utiliza renderizado dinámico para generar las tarjetas de servicios.

### `pages/productos`

Página de catálogo de productos. Muestra productos relacionados con la salud dental mediante datos cargados desde el backend.

### `pages/productos/detalle`

Componente de detalle de producto. Utiliza una ruta con parámetro para mostrar la información concreta de un producto seleccionado.

### `pages/contacto`

Página de contacto de la clínica. Incluye información de contacto y formulario para solicitar cita.

### `pages/login`

Componente para iniciar sesión. Está conectado con Firebase Authentication para validar usuarios reales.

### `pages/registro`

Componente para crear una cuenta nueva. Utiliza formularios de Angular y registra usuarios en Firebase Authentication.

### `pages/perfil`

Página protegida del usuario autenticado. Muestra datos personales y contenido asociado al usuario.

### `pages/citas`

Página protegida para consultar citas. Su contenido puede variar según el usuario autenticado y su rol.

### `pages/admin-crear-producto`

Panel de administración protegido. Permite crear nuevos productos, subir imágenes y guardar la información en Firebase.

---

## 🧭 Sistema de rutas

La navegación se gestiona mediante **Angular Router** en el archivo:

```text
src/app/app.routes.ts
```

Rutas principales:

```text
/inicio
/equipo
/servicios
/productos
/productos/:id
/contacto
/login
/registro
/perfil
/citas
/admin-crear-producto
```

Las rutas privadas se protegen mediante guards para controlar el acceso según autenticación y rol.

---

## 🛡️ Guards de acceso

### `auth.guard.ts`

Protege rutas privadas como `perfil` o `citas`. Comprueba si existe un usuario autenticado antes de permitir el acceso.

### `admin.guard.ts`

Protege rutas de administración, como `admin-crear-producto`. Verifica que el usuario autenticado tenga permisos de administrador.

---

## 🗃️ Servicios y gestión de datos

### `core/data.service.ts`

Servicio utilizado en la fase local para cargar contenido desde `db.json` mediante `HttpClient`.

### `core/services/data.ts`

Servicio principal de datos. Centraliza el acceso a Firebase Realtime Database y proporciona métodos para obtener o modificar información como:

* Inicio
* Equipo
* Servicios
* Productos
* Footer
* Perfil de usuario
* Citas

También incluye datos de respaldo mediante `data-fallback`, permitiendo que la aplicación mantenga contenido disponible si Firebase no devuelve información.

---

## 🔥 Integración con Firebase

En el Sprint 3 se ha integrado Firebase como backend de la aplicación. La configuración se encuentra en:

```text
src/app/app.config.ts
```

Firebase se utiliza para:

### Firebase Authentication

Gestiona el registro, inicio de sesión y sesión activa de los usuarios.

### Firebase Realtime Database

Almacena los datos dinámicos de la aplicación, sustituyendo el uso del JSON local como fuente final de datos.

### Firebase Storage

Permite subir imágenes desde el frontend, obtener su URL y asociarla a productos o elementos almacenados en la base de datos.

---

## 📝 Formularios y validaciones

La aplicación incluye formularios desarrollados con Angular, aplicando validaciones en cliente.

Formularios principales:

* Login
* Registro
* Contacto / solicitud de cita
* Creación de productos en el panel de administración

Se aplican validaciones como:

* Campos obligatorios
* Formato correcto de email
* Longitud mínima de contraseña
* Validación de datos de cita
* Validación de campos de producto
* Subida de archivo para imágenes

---

## 🛒 Panel de administración

El panel de administración permite añadir nuevos productos a la aplicación. Desde este panel se puede:

* Introducir nombre, descripción y otros datos del producto.
* Subir una imagen a Firebase Storage.
* Obtener la URL de la imagen subida.
* Guardar el producto completo en Firebase Realtime Database.
* Mostrar el producto dinámicamente en el catálogo.

---

## 📱 Diseño responsive

El diseño se mantiene adaptable a diferentes tamaños de pantalla mediante CSS, Flexbox y Grid. La interfaz se ajusta a:

* Escritorio
* Tablet
* Móvil

Se ha trabajado para que las secciones principales, tarjetas, formularios, cabecera y pie de página mantengan una visualización correcta en distintos dispositivos.

---

## 🚀 Instalación y ejecución

Para ejecutar el proyecto Angular:

```bash
cd SmileLab-Angular
npm install
ng serve
```

Después, abrir en el navegador:

```text
http://localhost:4200
```

---

## 📦 Tecnologías utilizadas

* Angular
* TypeScript
* HTML
* CSS
* Angular Router
* Angular Forms
* Firebase Authentication
* Firebase Realtime Database
* Firebase Storage
* GitHub
* Trello

---

## ✅ Resumen del Sprint 3

En este sprint se ha migrado la aplicación SmileLab a Angular, sustituyendo la estructura anterior basada en HTML, templates y JavaScript por una arquitectura de componentes, rutas y servicios.

Además, se ha integrado Firebase como backend para gestionar usuarios, datos dinámicos e imágenes. La aplicación queda preparada como una SPA moderna, modular, responsive y conectada a servicios en la nube.
