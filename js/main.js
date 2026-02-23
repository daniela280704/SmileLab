async function xLuIncludeFile() {
    // Buscamos todos los elementos con el atributo de inclusión
    let elements = document.querySelectorAll("[xlu-include-file]");

    for (let i = 0; i < elements.length; i++) {
        let el = elements[i];
        let file = el.getAttribute("xlu-include-file");

        try {
            let response = await fetch(file);
            if (response.ok) {
                let content = await response.text();

                // Lógica para inyectar datos en plantillas dinámicas (como el hero.html)
                if (file === "templates/hero.html" || file === "hero.html") {
                    let heroData = {
                        title: elements[i].getAttribute("data-title") || '',
                        text: elements[i].getAttribute("data-text") || '',
                        buttonText: elements[i].getAttribute("data-button-text") || '',
                        buttonLink: elements[i].getAttribute("data-button-link") || '#',
                        imageUrl: elements[i].getAttribute("data-image-url") || '',
                        imageAlt: elements[i].getAttribute("data-image-alt") || ''
                    };

                    content = content.replace(/{{title}}/g, heroData.title)
                        .replace(/{{text}}/g, heroData.text)
                        .replace(/{{buttonText}}/g, heroData.buttonText)
                        .replace(/{{buttonLink}}/g, heroData.buttonLink)
                        .replace(/{{imageUrl}}/g, heroData.imageUrl)
                        .replace(/{{imageAlt}}/g, heroData.imageAlt);
                }

                // Reemplazamos el marcador por el contenido real
                el.outerHTML = content;

                // Volvemos a escanear por si la pieza traída tiene más inclusiones (recursividad)
                await xLuIncludeFile();
            } else {
                console.error("Error: No se encontró el archivo " + file);
            }
        } catch (error) {
            console.error("Error de conexión al cargar plantilla:", error);
        }
    }
}

// Se ejecuta automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", xLuIncludeFile);