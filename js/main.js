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


function getTemplateFromHref(href) {
    if (!href) return null;
    const hash = href.split("?")[0];
    if (ROUTES[hash]) return ROUTES[hash];
    const path = hash === "" || hash.endsWith("/") ? "index.html" : hash.replace(/.*\//, "");
    return ROUTES[path] || null;
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

function setupNavigation() {
    document.addEventListener("click", async (e) => {
        const link = e.target.closest("a[href]");
        if (!link) return;

        const href = link.getAttribute("href");
        const template = getTemplateFromHref(href);

        if (!template || link.target === "_blank") return;
        if (href.startsWith("http") && new URL(link.href).origin !== window.location.origin) return;

        e.preventDefault();

        // Si el usuario clica en Perfil y ya "inició sesión" en la simulación
        if (href === "#login" && sessionStorage.getItem("isLoggedIn") === "true") {
            e.preventDefault();
            const perfilHref = "#perfil";
            const perfilTemplate = getTemplateFromHref(perfilHref);
            window.history.pushState({ template: perfilTemplate }, "", "index.html" + perfilHref);
            await loadPage(perfilTemplate);
            return;
        }

        const hash = (href === "" || href === "#" || href === "index.html") ? "#inicio" : (href.startsWith("#") ? href : "#" + href.replace(/.*\//, "").replace(".html", ""));
        const url = hash === "#inicio" ? "index.html" : "index.html" + hash;
        window.history.pushState({ template }, "", url);

        // Hide products on login page
        const productsElement = document.querySelector('[xlu-include-file="templates/products.html"]') || document.querySelector('.pre-footer-products');
        if (productsElement) {
            productsElement.style.display = hash === '#login' ? 'none' : 'block';
        }

        await loadPage(template);
    });

    document.addEventListener("submit", async (e) => {
        if (e.target.matches("form.login-form")) {
            e.preventDefault();
            sessionStorage.setItem("isLoggedIn", "true");

            // Redirect natively manually via JS since we prevented default
            const hash = "#perfil";
            window.history.pushState({ template: getTemplateFromHref(hash) }, "", "index.html" + hash);
            await loadPage(getTemplateFromHref(hash));
        }
    });

    window.addEventListener("popstate", async (e) => {
        const hash = window.location.hash || "#inicio";
        const productsElement = document.querySelector('[xlu-include-file="templates/products.html"]') || document.querySelector('.pre-footer-products');
        if (productsElement) {
            productsElement.style.display = hash === '#login' ? 'none' : 'block';
        }

        if (e.state && e.state.template) {
            await loadPage(e.state.template);
        } else {
            const template = ROUTES[hash] || ROUTES["#inicio"];
            await loadPage(template);
        }
    });
}

async function xLuIncludeFile() {
    let elements = Array.from(document.querySelectorAll("[xlu-include-file]"));

    if (elements.length === 0) return;

    for (let el of elements) {
        let file = el.getAttribute("xlu-include-file");
        el.removeAttribute("xlu-include-file");

        try {
            let response = await fetch(file);
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
    await xLuIncludeFile();
    setupNavigation();
    const hash = window.location.hash || "#inicio";

    const productsElement = document.querySelector('.pre-footer-products');
    if (productsElement) {
        productsElement.style.display = hash === '#login' ? 'none' : 'block';
    }

    const template = ROUTES[hash] || "pages/inicio.html";
    window.history.replaceState({ template }, "", "index.html" + (hash === "#inicio" ? "" : hash));
});
