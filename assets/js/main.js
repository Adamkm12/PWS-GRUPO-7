import { loadPartial, loadCards } from './modules/loader.js';
import { initMainServicesTemplate, initStickyHeader, initDarkMode, initContactModal, initScrollReveal, initMobileMenu, initAuthState } from './modules/ui.js';
import { renderServices, renderBookings } from './modules/render.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {

        await Promise.all([
            loadPartial("header-template", "../templates/partials/header.html"),
            loadPartial("footer-template", "../templates/partials/footer.html"),
            loadPartial("main-services-template", "../templates/partials/mainServices.html"),
            loadPartial("booking-header-template", "../templates/partials/bookingHeader.html"),
        ]);


        initStickyHeader();
        initDarkMode();
        initContactModal();
        initMobileMenu();
        initMainServicesTemplate();
        initAuthState();


        await Promise.all([
            loadCards(),
            renderServices(),
            renderBookings()
        ]);


        initScrollReveal();

    } catch (error) {
        console.error("Fallo en la inicialización:", error);
    }
});
