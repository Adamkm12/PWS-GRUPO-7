// ============================================================================================
//                            CARGA EL FORMATO DE LOS MainServices
// ============================================================================================
export function initMainServicesTemplate() {
    const container = document.getElementById("main-services-template");
    const template = document.querySelector(".service-main"); // El template cargado por loadPartial

    if (!container || !template) return;

    const body = document.body;
    const clone = template.content.cloneNode(true);

    // Seleccionamos los elementos dentro del clon
    const title = clone.getElementById("service-title");
    const subtitle = clone.getElementById("service-subtitle");
    const description = clone.getElementById("service-description");
    const hero = clone.getElementById("service-hero");

    // Rellenamos con los dataset del body
    if (title) title.textContent = body.dataset.serviceTitle || "";
    if (subtitle) subtitle.textContent = body.dataset.serviceSubtitle || "";
    if (description) description.textContent = body.dataset.serviceDescription || "";

    const heroImage = body.dataset.serviceHeroImage;
    if (heroImage && hero) {
        const isElegant = body.dataset.serviceStyle === "elegant";
        hero.style.backgroundImage = isElegant
            ? `url("${heroImage}")`
            : `linear-gradient(135deg, rgba(239, 237, 233, 0.2) 0%, rgba(228, 223, 216, 0.2) 100%), url("${heroImage}")`;
    }

    // Insertamos el contenido real en el div destinado a ello
    container.appendChild(clone);
}

// ============================================================================================
//                            FIJA EL HEADER CUANDO SCROLLEAS
// ============================================================================================
export function initStickyHeader(selector = ".load-header") {
    const header = document.querySelector(selector);
    if (!header) return;

    const updateSticky = () => {
        const isSticky = window.scrollY > 150;
        header.classList.toggle("is-sticky", isSticky);
        document.body.classList.toggle("has-sticky-header", isSticky);
    };

    window.addEventListener("scroll", updateSticky, { passive: true });
}


// ============================================================================================
//                            HABILITA EL BOTÓN DE: Dark-Mode
// ============================================================================================
export function initDarkMode() {
    const toggle = document.getElementById("darkModeCheckbox");
    const mobileDarkButton = document.getElementById("menuDarkModeButton");
    if (!toggle && !mobileDarkButton) return;

    const applyThemeState = (isDark) => {
        document.body.classList.toggle("dark-theme", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");

        if (toggle) toggle.checked = isDark;

        if (mobileDarkButton) {
            mobileDarkButton.setAttribute("aria-pressed", String(isDark));
            mobileDarkButton.classList.toggle("is-active", isDark);
            mobileDarkButton.textContent = isDark ? "Light mode" : "Dark mode";
        }
    };

    if (toggle) {
        toggle.addEventListener("change", () => {
            applyThemeState(toggle.checked);
        });
    }

    if (mobileDarkButton) {
        mobileDarkButton.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark-theme");
            applyThemeState(isDark);
        });
    }

    applyThemeState(localStorage.getItem("theme") === "dark");
}


// ============================================================================================
//                           HABILITA EL BOTÓN DE: Contact with us
// ============================================================================================
export function initContactModal() {
    const modal = document.getElementById("customModal");
    const btn = document.getElementById("ContactButton");
    const close = document.querySelector(".close-modal");

    if (btn && modal) {
        btn.onclick = () => modal.style.display = "flex";
        close.onclick = () => modal.style.display = "none";
        window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
    }
}


// ============================================================================================
//                CREA LAS ANIMACIONES CUANDO SCROLLEAS Y CARGAS LA PAG
// ============================================================================================
export function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

// ============================================================================================
//                 HABILITA MENU LATERAL DESPLEGABLE EN PANTALLAS PEQUENAS
// ============================================================================================
export function initMobileMenu() {
    const header = document.querySelector('.load-header');
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('#main-nav a');

    if (!header || !toggle || !overlay) return;

    const closeMenu = () => {
        header.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-lock');
    };

    const openMenu = () => {
        header.classList.add('menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-lock');
    };

    toggle.addEventListener('click', () => {
        if (header.classList.contains('menu-open')) {
            closeMenu();
            return;
        }
        openMenu();
    });

    overlay.addEventListener('click', closeMenu);
    menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
}
