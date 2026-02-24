const ROUTES = {
    "index.html": "templates/inicio.html",
    "": "templates/inicio.html",
    "#": "templates/inicio.html",
    "#inicio": "templates/inicio.html",
    "#equipo": "templates/equipo.html",
    "#servicios": "templates/servicios.html",
    "#contacto": "templates/contacto.html",
    "#perfil": "templates/perfil.html",
    "#citas": "templates/citas.html",
    "#utilidades": "templates/utilidades.html",
    "#producto": "templates/producto.html",
    "equipo.html": "templates/equipo.html",
    "servicios.html": "templates/servicios.html",
    "contacto.html": "templates/contacto.html",
    "perfil.html": "templates/perfil.html",
    "citas.html": "templates/citas.html",
    "utilidades.html": "templates/utilidades.html",
    "producto.html": "templates/producto.html"
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

        const hash = (href === "" || href === "#" || href === "index.html") ? "#inicio" : (href.startsWith("#") ? href : "#" + href.replace(/.*\//, "").replace(".html", ""));
        const url = hash === "#inicio" ? "index.html" : "index.html" + hash;
        window.history.pushState({ template }, "", url);
        await loadPage(template);
    });

    window.addEventListener("popstate", async (e) => {
        if (e.state && e.state.template) {
            await loadPage(e.state.template);
        } else {
            const template = ROUTES[window.location.hash] || ROUTES["#inicio"];
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
                        imageUrl: el.getAttribute("data-image-url") || '',
                        imageAlt: el.getAttribute("data-image-alt") || ''
                    };

                    let buttonHtml = heroData.buttonText ? `<a href="${heroData.buttonLink}"><button class="${heroData.buttonClass}">${heroData.buttonText}</button></a>` : '';

                    content = content.replace(/{{customClass}}/g, heroData.customClass)
                        .replace(/{{title}}/g, heroData.title)
                        .replace(/{{text}}/g, heroData.text)
                        .replace(/{{buttonHtml}}/g, buttonHtml)
                        .replace(/{{imageUrl}}/g, heroData.imageUrl)
                        .replace(/{{imageAlt}}/g, heroData.imageAlt);
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
    const template = ROUTES[hash] || "templates/inicio.html";
    window.history.replaceState({ template }, "", "index.html" + (hash === "#inicio" ? "" : hash));
});
