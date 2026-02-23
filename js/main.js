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
                if (el.hasAttribute("data-title")) {
                    content = content.replace(/{{title}}/g, el.getAttribute("data-title") || '')
                        .replace(/{{text}}/g, el.getAttribute("data-text") || '')
                        .replace(/{{imageUrl}}/g, el.getAttribute("data-image") || '')
                        .replace(/{{buttonText}}/g, el.getAttribute("data-btn-text") || 'Saber más')
                        .replace(/{{buttonLink}}/g, el.getAttribute("data-btn-link") || '#');
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