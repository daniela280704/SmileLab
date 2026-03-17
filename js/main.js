let usuariosDB = [];
let contenidoDB = {};

const ROUTES = {
    "index.html": "pages/inicio.html",
    "": "pages/inicio.html",
    "#": "pages/inicio.html",
    "#inicio": "pages/inicio.html",
    "#equipo": "pages/equipo.html",
    "#servicios": "pages/servicios.html",
    "#contacto": "pages/contacto.html",
    "#perfil": "pages/perfil.html",
    "#citas": "pages/citas.html",
    "#login": "pages/login.html",
    "#cepillo_electrico": "pages/cepillo_electrico.html",
    "#kit_blanqueamiento": "pages/kit_blanqueamiento.html",
    "#irrigador_bucal": "pages/irrigador_bucal.html",
    "equipo.html": "pages/equipo.html",
    "servicios.html": "pages/servicios.html",
    "contacto.html": "pages/contacto.html",
    "perfil.html": "pages/perfil.html",
    "citas.html": "pages/citas.html",
    "login.html": "pages/login.html",
    "cepillo_electrico.html": "pages/cepillo_electrico.html",
    "kit_blanqueamiento.html": "pages/kit_blanqueamiento.html",
    "irrigador_bucal.html": "pages/irrigador_bucal.html"
};

async function cargarBaseDeDatos() {
    try {
        // 1. Comprobamos si ya tenemos usuarios guardados en el navegador
        const usuariosGuardados = localStorage.getItem('usuariosGuardados');

        if (usuariosGuardados) {
            // Si hay datos en memoria, los cargamos (aquí estarán los nuevos registros)
            usuariosDB = JSON.parse(usuariosGuardados);
            console.log("Usuarios cargados desde la memoria del navegador:", usuariosDB);
        } else {
            // Si no hay datos (la primera vez que abres la web), leemos tu archivo db.json
            const respuesta = await fetch('./db.json');

            if (!respuesta.ok) {
                throw new Error('Error al leer el archivo db.json');
            }

            const datos = await respuesta.json();

            usuariosDB = Array.isArray(datos) ? datos[0].usuarios : (datos.usuarios || datos);

            console.log("Usuarios cargados desde el JSON por primera vez:", usuariosDB);

            // 2. IMPORTANTE: Guardamos estos usuarios iniciales en el navegador para el futuro
            localStorage.setItem('usuariosGuardados', JSON.stringify(usuariosDB));
        }
    } catch (error) {
        console.error("Hubo un problema cargando la base de datos:", error);
    }
}

async function cargarContenidoDB() {
    try {
        const respuesta = await fetch('./db.json');

        if (!respuesta.ok) {
            throw new Error('Error al leer el archivo db.json');
        }

        const datos = await respuesta.json();
        contenidoDB = datos;

        console.log("Contenido completo cargado desde db.json:", contenidoDB);
    } catch (error) {
        console.error("Hubo un problema cargando el contenido:", error);
    }
}

function getTemplateFromHref(href) {
    if (!href) return null;
    const hash = href.split("?")[0];
    if (ROUTES[hash]) return ROUTES[hash];
    const path = hash === "" || hash.endsWith("/") ? "index.html" : hash.replace(/.*\//, "");
    return ROUTES[path] || null;
}

function actualizarBotonHeader() {
    const contenedorAcciones = document.querySelector('.header-actions');
    if (!contenedorAcciones) return;

    const enlaceHeader = contenedorAcciones.querySelector('a');
    const botonDentro = contenedorAcciones.querySelector('button');
    const enlaceMobile = document.querySelector('.mobile-nav ul li a[href="#perfil"], .mobile-nav ul li a[href="#login"]');

    if (!enlaceHeader || !botonDentro) return;

    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userEmail = sessionStorage.getItem("userEmail");

    if (isLoggedIn && userEmail) {
        enlaceHeader.setAttribute("href", "#perfil");
        const nombreUsuario = userEmail.split('@')[0];
        botonDentro.textContent = `${nombreUsuario}`;

        if (enlaceMobile) {
            enlaceMobile.setAttribute("href", "#perfil");
            enlaceMobile.textContent = `${nombreUsuario}`;
        }
    } else {
        enlaceHeader.setAttribute("href", "#login");
        botonDentro.textContent = "Iniciar Sesión";

        if (enlaceMobile) {
            enlaceMobile.setAttribute("href", "#login");
            enlaceMobile.textContent = "Iniciar Sesión";
        }
    }
}

function actualizarEnlaceActivoMobile(hash) {
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    if (!mobileLinks.length) return;
    const currentHash = (hash === "" || hash === "#" || hash === "index.html" || !hash) ? "#inicio" : hash;
    mobileLinks.forEach(link => {
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function gestionarFormularioCitas() {
    const seccionFormulario = document.querySelector(".contact-form-section");
    const inputEmail = document.getElementById("user-email");

    if (!seccionFormulario) return;

    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const rolActual = sessionStorage.getItem("userRole");
    const emailActual = sessionStorage.getItem("userEmail");

    if (isLoggedIn && inputEmail) {
        inputEmail.value = emailActual;
        inputEmail.readOnly = true;
        inputEmail.style.backgroundColor = "#f0f0f0";
    }

    if (rolActual === "enfermero") {
        seccionFormulario.style.display = "none";

        let mensajeEnfermero = document.getElementById("mensaje-personal");
        if (!mensajeEnfermero) {
            mensajeEnfermero = document.createElement("div");
            mensajeEnfermero.id = "mensaje-personal";
            mensajeEnfermero.innerHTML = "<h3>Área de Personal</h3><p>Has iniciado sesión como Enfermero. Gestiona las citas desde tu panel de intranet.</p>";
            mensajeEnfermero.style.textAlign = "center";
            mensajeEnfermero.style.padding = "3rem 1rem";
            seccionFormulario.parentNode.insertBefore(mensajeEnfermero, seccionFormulario);
        }
    } else {
        seccionFormulario.style.display = "block";
        const msg = document.getElementById("mensaje-personal");
        if (msg) msg.remove();
    }
}

function actualizarDatosPerfil() {
    if (window.location.hash !== "#perfil") return;
    const emailActual = sessionStorage.getItem("userEmail");
    const usuario = usuariosDB.find(u => u.email === emailActual);

    if (usuario) {
        const tituloPerfil = document.querySelector(".perfil-hero h1, .perfil-hero h2");
        if (tituloPerfil && usuario.nombre) {
            tituloPerfil.textContent = `¡Hola, ${usuario.nombre.split(' ')[0]}!`;
        }
        const textoPerfil = document.querySelector(".perfil-hero p");
        if (textoPerfil) {
            textoPerfil.innerHTML = `
                <strong>Paciente:</strong> ${usuario.nombre || 'No especificado'}<br>
                <strong>Email:</strong> ${usuario.email}<br>
                <strong>Teléfono:</strong> ${usuario.telefono || 'No especificado'}<br>
                <strong>Próxima limpieza:</strong> ${usuario.proximaLimpieza || 'No especificada'}<br>
                <strong>Doctor habitual:</strong> ${usuario.doctor || 'No especificado'}
            `;
        }
    }
}

async function loadPage(templatePath) {
    const pageContent = document.getElementById("page-content");
    if (!pageContent) return;

    const wrapper = document.createElement("div");
    wrapper.setAttribute("xlu-include-file", templatePath);
    pageContent.innerHTML = "";
    pageContent.appendChild(wrapper);
    await xLuIncludeFile();
}

async function loadPageConContenido(templatePath) {
    await loadPage(templatePath);
    renderizarContenidoDinamico();
    gestionarFormularioCitas();
    actualizarDatosPerfil();
}

function renderizarContenidoDinamico() {
    const hash = window.location.hash || "#inicio";

    if (hash === "#inicio" || hash === "" || hash === "#") {
        renderInicioDinamico();
    }

    if (hash === "#equipo") {
        renderEquipoDinamico();
    }

    if (hash === "#servicios") {
        renderServiciosDinamico();
    }

    if (hash === "#contacto") {
        renderContactoDinamico();
    }
}

function renderInicioDinamico() {
    if (!contenidoDB.inicio) return;

    const titulo = document.getElementById("home-title");
    if (titulo) {
        titulo.textContent = contenidoDB.inicio.titulo || "";
    }

    const aboutTitle = document.getElementById("about-title");
    if (aboutTitle) {
        aboutTitle.textContent = contenidoDB.inicio.sobreNosotros?.titulo || "";
    }

    const aboutText = document.getElementById("about-text");
    if (aboutText) {
        aboutText.textContent = contenidoDB.inicio.sobreNosotros?.texto || "";
    }

    const aboutImage = document.getElementById("about-image");
    if (aboutImage) {
        aboutImage.src = contenidoDB.inicio.sobreNosotros?.imagen || "";
        aboutImage.alt = contenidoDB.inicio.sobreNosotros?.alt || "";
    }

    const aboutButton = document.getElementById("about-button");
    if (aboutButton) {
        aboutButton.textContent = contenidoDB.inicio.sobreNosotros?.botonTexto || "";
        aboutButton.href = contenidoDB.inicio.sobreNosotros?.botonLink || "#";
    }
}

function renderEquipoDinamico() {
    if (!contenidoDB.equipo) return;

    const titulo = document.getElementById("team-title");
    if (titulo) {
        titulo.textContent = contenidoDB.equipo.titulo || "";
    }

    const contenedor = document.getElementById("team-members");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    (contenidoDB.equipo.miembros || []).forEach(miembro => {
        contenedor.innerHTML += `
            <article class="team-card">
                <img src="${miembro.imagen}" alt="${miembro.alt}">
                <h3>${miembro.nombre}</h3>
                <p><strong>${miembro.cargo}</strong></p>
                <p>${miembro.descripcion}</p>
            </article>
        `;
    });
}

function renderServiciosDinamico() {
    if (!contenidoDB.servicios) return;

    const titulo = document.getElementById("services-title");
    if (titulo) {
        titulo.textContent = contenidoDB.servicios.titulo || "";
    }

    const contenedor = document.getElementById("services-container");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    (contenidoDB.servicios.items || []).forEach(servicio => {
        contenedor.innerHTML += `
            <article class="service-card">
                <img src="${servicio.imagen}" alt="${servicio.alt}">
                <h3>${servicio.titulo}</h3>
                <p>${servicio.descripcion}</p>
            </article>
        `;
    });
}

function renderContactoDinamico() {
    if (!contenidoDB.contacto) return;

    const titulo = document.getElementById("contact-title");
    if (titulo) {
        titulo.textContent = contenidoDB.contacto.titulo || "";
    }

    const telefono = document.getElementById("contact-phone");
    if (telefono) {
        telefono.textContent = contenidoDB.contacto.telefono || "";
    }

    const whatsapp = document.getElementById("contact-whatsapp");
    if (whatsapp) {
        whatsapp.textContent = contenidoDB.contacto.whatsapp || "";
    }

    const email = document.getElementById("contact-email");
    if (email) {
        email.textContent = contenidoDB.contacto.email || "";
    }
}

function setupNavigation() {
    document.addEventListener("click", async (e) => {
        if (e.target.closest(".btn-logout")) {
            e.preventDefault();
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("userEmail");
            actualizarBotonHeader();
            const hash = "#inicio";
            const template = getTemplateFromHref(hash);
            window.history.pushState({ template }, "", "index.html" + hash);
            await loadPageConContenido(template);
            actualizarEnlaceActivoMobile(hash);
            return;
        }

        const link = e.target.closest("a[href]");
        if (!link) return;

        const href = link.getAttribute("href");
        const template = getTemplateFromHref(href);

        if (!template || link.target === "_blank") return;
        if (href.startsWith("http") && new URL(link.href).origin !== window.location.origin) return;

        e.preventDefault();

        if (href === "#login" && sessionStorage.getItem("isLoggedIn") === "true") {
            e.preventDefault();
            const perfilHref = "#perfil";
            const perfilTemplate = getTemplateFromHref(perfilHref);
            window.history.pushState({ template: perfilTemplate }, "", "index.html" + perfilHref);
            await loadPageConContenido(perfilTemplate);
            actualizarEnlaceActivoMobile(perfilHref);
            return;
        }

        const hash = (href === "" || href === "#" || href === "index.html") ? "#inicio" : (href.startsWith("#") ? href : "#" + href.replace(/.*\//, "").replace(".html", ""));
        const url = hash === "#inicio" ? "index.html" : "index.html" + hash;
        window.history.pushState({ template }, "", url);

        const productsElement = document.querySelector('[xlu-include-file="templates/products.html"]') || document.querySelector('.pre-footer-products');
        if (productsElement) {
            productsElement.style.display = hash === '#login' ? 'none' : 'block';
        }

        await loadPageConContenido(template);
        actualizarEnlaceActivoMobile(hash);
    });

    document.addEventListener("submit", async (e) => {
        if (e.target.matches("form.login-form")) {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const pass = document.getElementById("login-password").value;
            const userMatch = usuariosDB.find(u => u.email === email && u.pass === pass);

            if (userMatch) {
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("userRole", userMatch.rol);
                sessionStorage.setItem("userEmail", userMatch.email);
                actualizarBotonHeader();
                const hash = "#perfil";
                window.history.pushState({ template: getTemplateFromHref(hash) }, "", "index.html" + hash);
                await loadPageConContenido(getTemplateFromHref(hash));
                actualizarEnlaceActivoMobile(hash);
            } else {
                alert("Credenciales incorrectas. Revisa tu email o contraseña.");
            }
        }
        else if (e.target.matches("form.combined-form")) {
            e.preventDefault(); // Evitamos que la página recargue

            // 1. Recogemos los datos personales y de cuenta
            const nombre = document.getElementById("reg-nombre").value;
            const email = document.getElementById("user-email").value; // Usamos el ID unificado
            const tel = document.getElementById("reg-tel").value;
            const pass = document.getElementById("reg-password").value;

            // 2. Recogemos los datos de la cita médica
            const dia = document.getElementById("appointment-day").value;
            const hora = document.getElementById("appointment-time").value;
            const motivo = document.getElementById("appointment-reason").value;
            const profesional = document.getElementById("appointment-professional").value;

            // 3. Comprobamos si el email ya existe en nuestra "base de datos"
            const existe = usuariosDB.find(u => u.email === email);
            if (existe) {
                alert("Este correo ya está registrado. Por favor, ve a la página de Login para entrar y pedir tu cita.");
                return;
            }

            // 4. Creamos el nuevo usuario guardando TAMBIÉN su cita
            const nuevoUsuario = {
                email: email,
                pass: pass,
                rol: "usuario",
                nombre: nombre,
                telefono: tel,
                proximaLimpieza: `${dia} a las ${hora}`,
                doctor: profesional,
                motivoCita: motivo
            };

            usuariosDB.push(nuevoUsuario); // Lo guardamos en memoria
            localStorage.setItem("usuariosGuardados", JSON.stringify(usuariosDB));

            // 5. Lo logueamos automáticamente (Autenticación)
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("userRole", "usuario");
            sessionStorage.setItem("userEmail", email);
            sessionStorage.setItem("userName", nombre);

            // 6. Actualizamos el diseño de la web (Control de acceso/Roles)
            if (typeof actualizarBotonHeader === "function") {
                actualizarBotonHeader();
            }

            alert("¡Registro y cita completados con éxito! Bienvenido a SmileLab.");

            // 7. Redirigimos al área privada (Perfil)
            const hash = "#perfil";
            window.history.pushState({ template: getTemplateFromHref(hash) }, "", "index.html" + hash);
            if (typeof loadPageConContenido === "function") {
                await loadPageConContenido(getTemplateFromHref(hash));
            }
        }
    });

    document.addEventListener("click", (e) => {
        // Lógica del Acordeón en Servicios
        const h3 = e.target.closest('.feature-block h3');
        if (h3) {
            if (window.innerWidth <= 768) {
                const block = h3.closest('.feature-block');
                const icon = block.querySelector('.accordion-icon');
                if (block && icon) {
                    block.classList.toggle('expanded');
                    icon.textContent = block.classList.contains('expanded') ? '✕' : '☰';
                }
            }
            return;
        }

        // Lógica del Menú Móvil
        const menuBtn = e.target.closest('.btn-menu-mobile');
        if (menuBtn) {
            document.body.classList.toggle('menu-open');
            // Cambiar texto del botón si es necesario (opcional, el diseño usa "Menú" siempre)
            return;
        }

        // Si se hace clic en un enlace del menú móvil, cerrarlo
        const mobileNavLink = e.target.closest('.mobile-menu-overlay a');
        if (mobileNavLink) {
            document.body.classList.remove('menu-open');
        }
    });

    window.addEventListener("popstate", async (e) => {
        const hash = window.location.hash || "#inicio";
        const productsElement = document.querySelector('[xlu-include-file="templates/products.html"]') || document.querySelector('.pre-footer-products');
        if (productsElement) {
            productsElement.style.display = hash === '#login' ? 'none' : 'block';
        }

        if (e.state && e.state.template) {
            await loadPageConContenido(e.state.template);
        } else {
            const template = ROUTES[hash] || ROUTES["#inicio"];
            await loadPageConContenido(template);
        }
        actualizarEnlaceActivoMobile(hash);
    });
}

async function xLuIncludeFile() {
    let elements = Array.from(document.querySelectorAll("[xlu-include-file]"));

    if (elements.length === 0) return;

    for (let el of elements) {
        let file = el.getAttribute("xlu-include-file");
        el.removeAttribute("xlu-include-file");

        try {
            let response = await fetch(file + "?v=" + new Date().getTime());
            if (response.ok) {
                let content = await response.text();

                if (file === "templates/hero.html" || file === "hero.html") {
                    let heroData = {
                        customClass: el.getAttribute("data-custom-class") || 'hero-section',
                        title: el.getAttribute("data-title") || '',
                        text: el.getAttribute("data-text") || '',
                        buttonText: el.getAttribute("data-button-text") || '',
                        buttonLink: el.getAttribute("data-button-link") || '#',
                        buttonClass: el.getAttribute("data-button-class") || 'btn-primary',
                        buttonTarget: el.getAttribute("data-button-target") || '_self',
                        imageUrl: el.getAttribute("data-image-url") || '',
                        imageAlt: el.getAttribute("data-image-alt") || ''
                    };

                    let targetAttr = heroData.buttonTarget !== '_self' ? ` target="${heroData.buttonTarget}" rel="noopener noreferrer"` : '';
                    let buttonHtml = heroData.buttonText ? `<a href="${heroData.buttonLink}"${targetAttr}><button class="${heroData.buttonClass}">${heroData.buttonText}</button></a>` : '';

                    content = content.replace(/{{customClass}}/g, heroData.customClass)
                        .replace(/{{title}}/g, heroData.title)
                        .replace(/{{text}}/g, heroData.text)
                        .replace(/{{buttonHtml}}/g, buttonHtml)
                        .replace(/{{imageUrl}}/g, heroData.imageUrl)
                        .replace(/{{imageAlt}}/g, heroData.imageAlt);
                } else if (file === "templates/form.html" || file === "form.html") {
                    let formData = {
                        sectionClass: el.getAttribute("data-section-class") || '',
                        titleTag: el.getAttribute("data-title-tag") || 'h2',
                        title: el.getAttribute("data-title") || '',
                        formAction: el.getAttribute("data-form-action") || '#',
                        formMethod: el.getAttribute("data-form-method") || 'post',
                        formClass: el.getAttribute("data-form-class") || '',
                        btnContainerClass: el.getAttribute("data-btn-container-class") || '',
                        btnClass: el.getAttribute("data-btn-class") || '',
                        btnText: el.getAttribute("data-btn-text") || 'Enviar'
                    };

                    let titleHtml = formData.title ? `<${formData.titleTag}>${formData.title}</${formData.titleTag}>` : '';
                    let innerContent = el.innerHTML;

                    content = content.replace(/{{sectionClass}}/g, formData.sectionClass)
                        .replace(/{{titleHtml}}/g, titleHtml)
                        .replace(/{{formAction}}/g, formData.formAction)
                        .replace(/{{formMethod}}/g, formData.formMethod)
                        .replace(/{{formClass}}/g, formData.formClass)
                        .replace(/{{btnContainerClass}}/g, formData.btnContainerClass)
                        .replace(/{{btnClass}}/g, formData.btnClass)
                        .replace(/{{btnText}}/g, formData.btnText)
                        .replace(/{{slot}}/g, innerContent);
                }

                el.outerHTML = content;

            } else {
                console.error("Error: No se encontró el archivo " + file);
            }
        } catch (error) {
            console.error("Error de conexión al cargar plantilla:", error);
        }
    }

    await xLuIncludeFile();
}

document.addEventListener("DOMContentLoaded", async () => {
    await cargarBaseDeDatos();
    await cargarContenidoDB();
    await xLuIncludeFile();
    actualizarBotonHeader();
    setupNavigation();
    gestionarFormularioCitas();
    actualizarDatosPerfil();
    const hash = window.location.hash || "#inicio";

    const productsElement = document.querySelector('.pre-footer-products');
    if (productsElement) {
        productsElement.style.display = hash === '#login' ? 'none' : 'block';
    }

    const template = ROUTES[hash] || "pages/inicio.html";
    window.history.replaceState({ template }, "", "index.html" + (hash === "#inicio" ? "" : hash));
    await loadPageConContenido(template);
    actualizarEnlaceActivoMobile(hash);
});


