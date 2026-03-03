import { loadPartial, loadCards } from './modules/loader.js';
import { initMainServicesTemplate, initStickyHeader, initDarkMode, initContactModal, initScrollReveal } from './modules/ui.js';
import { renderServices, renderBookings } from './modules/render.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. Cargar estructuras básicas
        await Promise.all([
            loadPartial("header-template", "../templates/partials/header.html"),
            loadPartial("footer-template", "../templates/partials/footer.html"),
            loadPartial("main-services-template", "../templates/partials/mainServices.html"),
            loadPartial("booking-header-template", "../templates/partials/bookingHeader.html"),
        ]);

        // 2. Inicializar UI estática
        initStickyHeader();
        initDarkMode();
        initContactModal();
        initMainServicesTemplate();

        // 3. Cargar y renderizar contenido dinámico
        await Promise.all([
            loadCards(),
            renderServices(),
            renderBookings()
        ]);

        // 4. Activar animaciones (siempre al final)
        initScrollReveal();

    } catch (error) {
        console.error("Fallo en la inicialización:", error);
    }
});
