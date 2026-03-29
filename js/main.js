/* Archivo principal con toda la lógica dinámica Javascript de la aplicación */
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
        const usuariosGuardados = localStorage.getItem('usuariosGuardados');
        if (usuariosGuardados) {
            usuariosDB = JSON.parse(usuariosGuardados);
            console.log("Usuarios cargados desde la memoria del navegador:", usuariosDB);
        } else {
            const respuesta = await fetch('./db.json');
            if (!respuesta.ok) {
                throw new Error('Error al leer el archivo db.json');
            }
            const datos = await respuesta.json();
            usuariosDB = Array.isArray(datos) ? datos[0].usuarios : (datos.usuarios || datos);
            console.log("Usuarios cargados desde el JSON por primera vez:", usuariosDB);
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
    const path = hash === "" || hash.endsWith("/") ? "index.html" : hash.replace(/.*\/|\.html$/g, "");
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
    const regCampos = ["reg-nombre", "reg-tel", "reg-password"];
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
        if (isLoggedIn) {
            const titulo = seccionFormulario.querySelector("h3");
            const boton = seccionFormulario.querySelector("button");
            if (titulo) titulo.textContent = "Solicita una nueva cita";
            if (boton) boton.textContent = "Confirmar cita";
            regCampos.forEach(id => {
                const input = document.getElementById(id);
                const label = document.querySelector(`label[for="${id}"]`);
                if (input) {
                    input.style.display = "none";
                    input.removeAttribute("required"); 
                }
                if (label) label.style.display = "none";
            });
        } else {
            const titulo = seccionFormulario.querySelector("h3");
            const boton = seccionFormulario.querySelector("button");
            if (titulo) titulo.textContent = "Solicita tu cita y crea tu cuenta";
            if (boton) boton.textContent = "Enviar y registrarme";
            regCampos.forEach(id => {
                const input = document.getElementById(id);
                const label = document.querySelector(`label[for="${id}"]`);
                if (input) {
                    input.style.display = "block";
                    input.setAttribute("required", "true");
                }
                if (label) label.style.display = "block";
            });
        }
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
    inicializarFlatpickr();
    cargarMisCitas();
}
function inicializarFlatpickr() {
    if (typeof flatpickr !== "undefined") {
        const dateInput = document.getElementById("appointment-day");
        if (dateInput && !dateInput.classList.contains("flatpickr-input")) {
            flatpickr(dateInput, {
                dateFormat: "Y-m-d",
                minDate: "today",
                disableMobile: true
            });
        }
        const timeInput = document.getElementById("appointment-time");
        if (timeInput && !timeInput.classList.contains("flatpickr-input")) {
            flatpickr(timeInput, {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                disableMobile: true
            });
        }
    }
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
    if (hash === "#cepillo_electrico" || hash === "#kit_blanqueamiento" || hash === "#irrigador_bucal") {
        renderDetalleProducto(hash);
    }
    renderProductosDinamico();
    renderFooterDinamico();
}
function renderInicioDinamico() {
    if (!contenidoDB.inicio) return;
    const titulo = document.getElementById("home-title");
    if (titulo) titulo.textContent = contenidoDB.inicio.titulo || "";
    
    const aboutTitle = document.getElementById("about-title");
    if (aboutTitle) aboutTitle.textContent = contenidoDB.inicio.sobreNosotros?.titulo || "";
    
    const aboutText = document.getElementById("about-text");
    if (aboutText) aboutText.textContent = contenidoDB.inicio.sobreNosotros?.texto || "";
    
    const aboutImage = document.getElementById("about-image");
    if (aboutImage) {
        aboutImage.src = contenidoDB.inicio.sobreNosotros?.imagen || "";
        aboutImage.alt = contenidoDB.inicio.sobreNosotros?.alt || "";
    }
    const aboutButton = document.getElementById("about-button");
    if (aboutButton) {
        const btn = aboutButton.querySelector("button");
        if (btn) btn.textContent = contenidoDB.inicio.sobreNosotros?.botonTexto || "";
        aboutButton.href = contenidoDB.inicio.sobreNosotros?.botonLink || "#";
    }

    const servTitle = document.getElementById("home-services-title");
    if (servTitle) servTitle.textContent = contenidoDB.inicio.servicios?.titulo || "";
    
    const servGrid = document.getElementById("home-services-grid");
    if (servGrid && contenidoDB.inicio.servicios?.items) {
        servGrid.innerHTML = "";
        contenidoDB.inicio.servicios.items.forEach(srv => {
            servGrid.innerHTML += `
                <article>
                    <img src="${srv.imagen}" alt="${srv.alt}" class="thumb-placeholder">
                    <h3>${srv.titulo}</h3>
                    <p>${srv.descripcion}</p>
                </article>
            `;
        });
    }

    const servButton = document.getElementById("home-services-button");
    if (servButton) {
        const btn = servButton.querySelector("button");
        if (btn) btn.textContent = contenidoDB.inicio.servicios?.botonTexto || "";
        servButton.href = contenidoDB.inicio.servicios?.botonLink || "#";
    }
}
function renderEquipoDinamico() {
    if (!contenidoDB.equipo) return;
    
    const heroTitle = document.getElementById("team-hero-title");
    if (heroTitle) heroTitle.textContent = contenidoDB.equipo.titulo || "";
    const heroText = document.getElementById("team-hero-text");
    if (heroText) heroText.textContent = contenidoDB.equipo.descripcion || "";
    const heroImage = document.getElementById("team-hero-image");
    if (heroImage) {
        heroImage.src = contenidoDB.equipo.imagen || "";
        heroImage.alt = contenidoDB.equipo.alt || "";
    }

    const titulo = document.getElementById("team-title");
    if (titulo) titulo.textContent = contenidoDB.equipo.subtitulo || "";
    
    const contenedor = document.getElementById("team-members");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    (contenidoDB.equipo.miembros || []).forEach(miembro => {
        contenedor.innerHTML += `
            <article>
                <img src="${miembro.imagen}" alt="${miembro.alt}" class="thumb-placeholder">
                <h3>${miembro.nombre}</h3>
                <p><strong>${miembro.cargo}</strong> ${miembro.descripcion || ""}</p>
            </article>
        `;
    });
}
function renderServiciosDinamico() {
    if (!contenidoDB.servicios) return;
    const titulo = document.getElementById("services-title");
    if (titulo) titulo.textContent = contenidoDB.servicios.titulo || "";
    
    const contenedor = document.getElementById("services-container");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    (contenidoDB.servicios.items || []).forEach(servicio => {
        contenedor.innerHTML += `
            <article class="feature-block">
                <img src="${servicio.imagen}" alt="${servicio.alt}" class="img-box-gris">
                <div>
                    <h3>${servicio.titulo} <span class="accordion-icon">☰</span></h3>
                    <p>${servicio.descripcion}</p>
                </div>
            </article>
        `;
    });
}
function renderContactoDinamico() {
    if (!contenidoDB.contacto) return;
    
    const heroTitle = document.getElementById("contact-hero-title");
    if (heroTitle) heroTitle.textContent = contenidoDB.contacto.titulo || "";
    
    const subTitle = document.getElementById("contact-sub-title");
    if (subTitle) subTitle.textContent = contenidoDB.contacto.subtitulo || "";
    
    const telefono = document.getElementById("contact-phone");
    if (telefono) {
        telefono.textContent = contenidoDB.contacto.telefono || "";
        telefono.href = contenidoDB.contacto.linkTfno || "";
    }
    const whatsapp = document.getElementById("contact-whatsapp");
    if (whatsapp) {
        whatsapp.textContent = contenidoDB.contacto.whatsapp || "";
        whatsapp.href = contenidoDB.contacto.linkWhatsapp || "";
    }
    const email = document.getElementById("contact-email");
    if (email) {
        email.textContent = contenidoDB.contacto.email || "";
        email.href = contenidoDB.contacto.linkEmail || "";
    }
    
    const mapTitle = document.getElementById("contact-map-title");
    if (mapTitle && contenidoDB.contacto.mapa) {
        mapTitle.textContent = contenidoDB.contacto.mapa.titulo || "";
    }
    
    const mapText = document.getElementById("contact-map-text");
    if (mapText && contenidoDB.contacto.mapa) {
        mapText.innerHTML = contenidoDB.contacto.mapa.texto || "";
    }
    
    const mapBtn = document.getElementById("contact-map-button");
    if (mapBtn && contenidoDB.contacto.mapa) {
        mapBtn.href = contenidoDB.contacto.mapa.linkMaps || "#";
    }
    
    const mapImg = document.getElementById("contact-map-image");
    if (mapImg && contenidoDB.contacto.mapa) {
        mapImg.src = contenidoDB.contacto.mapa.imagen || "";
    }
}
function renderDetalleProducto(hash) {
    if (!contenidoDB.productos) return;
    const prodId = hash.replace("#", "");
    const prod = (contenidoDB.productos.items || []).find(p => p.id === prodId);
    if (!prod) return;
    
    const heroSection = document.querySelector("#page-content .hero-section");
    if (!heroSection) return;
    
    const h1 = heroSection.querySelector("h1");
    if (h1) h1.textContent = prod.nombre || "";
    
    const p = heroSection.querySelector("p");
    if (p) p.textContent = prod.descripcion || "";
    
    const img = heroSection.querySelector("img");
    if (img) {
        img.src = prod.imagen || "";
        img.alt = prod.alt || "";
    }
    
    const btn = heroSection.querySelector("button");
    if (btn) btn.textContent = prod.precio || "Comprar";
}
function renderProductosDinamico() {
    if (!contenidoDB.productos) return;
    const container = document.getElementById("products-container");
    if (!container) return;
    
    container.innerHTML = "";
    (contenidoDB.productos.items || []).forEach(prod => {
        container.innerHTML += `
            <a href="${prod.href}" class="product-card-link">
                <article class="product-card-mini">
                    <header>
                        <h4>${prod.nombre}</h4>
                    </header>
                    <div class="product-image-container ${prod.placeholderClass}">
                        <img src="${prod.imagen}" alt="${prod.alt}" class="product-image">
                    </div>
                </article>
            </a>
        `;
    });
}
function renderFooterDinamico() {
    if (!contenidoDB.footer) return;
    
    document.querySelectorAll(".dyn-footer-marca").forEach(el => {
        el.textContent = contenidoDB.footer.marca || "";
    });
    
    document.querySelectorAll(".dyn-footer-texto").forEach(el => {
        el.textContent = contenidoDB.footer.texto || "";
    });
    
    if (contenidoDB.footer.columnas && contenidoDB.footer.columnas[0]) {
        const colData = contenidoDB.footer.columnas[0];
        document.querySelectorAll(".dyn-footer-col-1").forEach(el => {
            el.innerHTML = `<h4>${colData.titulo}</h4><ul>` + 
                colData.enlaces.map(e => `<li><a href="${e.link}">${e.texto}</a></li>`).join("") +
                `</ul>`;
        });
    }
    
    if (contenidoDB.footer.columnas && contenidoDB.footer.columnas[1]) {
        const colData = contenidoDB.footer.columnas[1];
        document.querySelectorAll(".dyn-footer-col-2").forEach(el => {
            el.innerHTML = `<h4>${colData.titulo}</h4><ul>` + 
                colData.enlaces.map(e => `<li><a href="${e.link}">${e.texto}</a></li>`).join("") +
                `</ul>`;
        });
    }
    
    if (contenidoDB.footer.contacto) {
        document.querySelectorAll(".dyn-footer-contact-title").forEach(el => {
            el.textContent = contenidoDB.footer.contacto.titulo || "Contacto";
        });
        
        const { direccion, linkMaps, telefono, linkTfno, email, linkEmail } = contenidoDB.footer.contacto;
        const htmlContacto = `
            <li class="contact-item">
                <a href="${linkMaps}" target="_blank" rel="noopener noreferrer">
                    <span class="contact-icon">📍</span><span class="contact-text">${direccion}</span>
                </a>
            </li>
            <li class="contact-item">
                <a href="${linkTfno}"><span class="contact-icon">📞</span><span class="contact-text">${telefono}</span></a>
            </li>
            <li class="contact-item">
                <a href="${linkEmail}"><span class="contact-icon">✉️</span><span class="contact-text">${email}</span></a>
            </li>
        `;
        document.querySelectorAll(".dyn-footer-contact-list").forEach(el => {
            el.innerHTML = htmlContacto;
        });
    }
    
    if (contenidoDB.footer.legal) {
        document.querySelectorAll(".dyn-footer-copyright").forEach(el => {
             el.textContent = contenidoDB.footer.legal.copyright || "";
        });
        
        if (contenidoDB.footer.legal.enlaces) {
            const htmlLegal = contenidoDB.footer.legal.enlaces.map(l => `<span>${l}</span>`).join(" | ");
            document.querySelectorAll(".dyn-footer-legal-links").forEach(el => {
                 el.innerHTML = htmlLegal;
            });
        }
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
        const hash = (href === "" || href === "#" || href === "index.html") ? "#inicio" : (href.startsWith("#") ? href : "#" + href.replace(/.*\/|\.html$/g, ""));
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
            e.preventDefault();
            const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
            const email = document.getElementById("user-email").value;
            const dia = document.getElementById("appointment-day").value;
            const hora = document.getElementById("appointment-time").value;
            const motivo = document.getElementById("appointment-reason").value;
            const profesional = document.getElementById("appointment-professional").value;
            const nuevaCitaObj = {
                fechaHora: `${dia} a las ${hora}`,
                doctor: profesional,
                motivo: motivo
            };
            if (isLoggedIn) {
                const usuario = usuariosDB.find(u => u.email === email);
                if (usuario) {
                    if (!usuario.citas) usuario.citas = []; 
                    usuario.citas.push(nuevaCitaObj); 
                    usuario.proximaLimpieza = nuevaCitaObj.fechaHora;
                    usuario.doctor = profesional;
                    usuario.motivoCita = motivo;
                    localStorage.setItem("usuariosGuardados", JSON.stringify(usuariosDB));
                    alert("¡Tu nueva cita se ha guardado y añadido a tu agenda!");
                    const hash = "#citas"; 
                    window.history.pushState({ template: getTemplateFromHref(hash) }, "", "index.html" + hash);
                    await loadPageConContenido(getTemplateFromHref(hash));
                }
            } else {
                const nombre = document.getElementById("reg-nombre").value;
                const tel = document.getElementById("reg-tel").value;
                const pass = document.getElementById("reg-password").value;
                const existe = usuariosDB.find(u => u.email === email);
                if (existe) {
                    alert("Este correo ya está registrado. Por favor inicia sesión.");
                    return;
                }
                const nuevoUsuario = {
                    email: email,
                    pass: pass,
                    rol: "usuario",
                    nombre: nombre,
                    telefono: tel,
                    citas: [nuevaCitaObj], 
                    proximaLimpieza: nuevaCitaObj.fechaHora,
                    doctor: profesional,
                    motivoCita: motivo
                };
                usuariosDB.push(nuevoUsuario);
                localStorage.setItem("usuariosGuardados", JSON.stringify(usuariosDB));
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("userRole", "usuario");
                sessionStorage.setItem("userEmail", email);
                sessionStorage.setItem("userName", nombre);
                if (typeof actualizarBotonHeader === "function") actualizarBotonHeader();
                alert("¡Registro y cita completados con éxito! Bienvenido a SmileLab.");
                const hash = "#citas";
                window.history.pushState({ template: getTemplateFromHref(hash) }, "", "index.html" + hash);
                if (typeof loadPageConContenido === "function") {
                    await loadPageConContenido(getTemplateFromHref(hash));
                }
            }
        }
    });
    document.addEventListener("click", (e) => {
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
        const menuBtn = e.target.closest('.btn-menu-mobile');
        if (menuBtn) {
            document.body.classList.toggle('menu-open');
            return;
        }
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
function cargarMisCitas() {
    const contenedor = document.getElementById("contenedor-citas");
    if (!contenedor) return;
    const emailActual = sessionStorage.getItem("userEmail");
    const rolActual = sessionStorage.getItem("userRole");
    if (!emailActual) {
        contenedor.innerHTML = "<p style='text-align:center; width:100%;'>Debes iniciar sesión para ver las citas.</p>";
        return;
    }
    contenedor.innerHTML = "";
    if (rolActual === "enfermero") {
        let hayCitas = false;
        usuariosDB.forEach(paciente => {
            let listaCitas = paciente.citas || [];
            if (listaCitas.length === 0 && paciente.motivoCita) {
                listaCitas = [{ motivo: paciente.motivoCita, fechaHora: paciente.proximaLimpieza, doctor: paciente.doctor }];
            }
            if (listaCitas.length > 0) {
                hayCitas = true;
                listaCitas.forEach(cita => {
                    contenedor.innerHTML += `
                        <article style="border-left: 4px solid #0056b3;">
                            <h3>${cita.motivo}</h3>
                            <p><strong>Paciente:</strong> ${paciente.nombre} (Tel: ${paciente.telefono || 'No indicado'})</p>
                            <p><strong>Fecha y hora:</strong> ${cita.fechaHora}</p>
                            <p><strong>Profesional solicitado:</strong> ${cita.doctor}</p>
                            <p><em>Estado: Pendiente de atender</em></p>
                        </article>
                    `;
                });
            }
        });
        if (!hayCitas) {
            contenedor.innerHTML = "<p style='text-align:center; width:100%;'>No hay ninguna cita programada en la agenda hoy.</p>";
        }
    }
    else {
        const usuario = usuariosDB.find(u => u.email === emailActual);
        if (usuario) {
            let listaCitas = usuario.citas || [];
            if (listaCitas.length === 0 && usuario.motivoCita) {
                listaCitas = [{ motivo: usuario.motivoCita, fechaHora: usuario.proximaLimpieza, doctor: usuario.doctor }];
            }
            if (listaCitas.length > 0) {
                listaCitas.forEach(cita => {
                    contenedor.innerHTML += `
                        <article>
                            <h3>${cita.motivo}</h3>
                            <p><strong>Fecha y hora:</strong> ${cita.fechaHora}</p>
                            <p><strong>Doctor:</strong> ${cita.doctor}</p>
                            <p><em>Estado: Próxima</em></p>
                            <div class="acciones-cita">
                                <p style="font-size: 0.85rem; color: #666; margin: 0;">Para modificar o cancelar, <a href="#contacto">contáctanos</a>.</p>
                            </div>
                        </article>
                    `;
                });
            } else {
                contenedor.innerHTML = `<p style="text-align:center; width:100%;">No tienes ninguna cita programada actualmente.</p>`;
            }
        }
    }
}
