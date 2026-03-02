// Activa un header fijo al hacer scroll y evita inicializarlo dos veces.
function initStickyHeader(selector = ".load-header") {
    const header = document.querySelector(selector) || document.querySelector(".header");

    if (!header || header.dataset.stickyInit === "true") {
        return;
    }

    header.dataset.stickyInit = "true";

    const body = document.body;
    let stickyHeight = header.offsetHeight;

    // Cambia clases visuales cuando se supera la altura inicial del header.
    const updateSticky = () => {
        const isSticky = window.scrollY > stickyHeight;
        header.classList.toggle("is-sticky", isSticky);
        body.classList.toggle("has-sticky-header", isSticky);
    };

    // Recalcula altura útil en resize para mantener el umbral correcto.
    const refreshHeight = () => {
        header.classList.remove("is-sticky");
        body.classList.remove("has-sticky-header");
        stickyHeight = header.offsetHeight;
        updateSticky();
    };

    refreshHeight();
    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", refreshHeight);
}

// Expuesto en window para poder inicializarlo desde otros módulos al terminar de cargar templates.
window.initStickyHeader = initStickyHeader;
