import { getCurrentUser, logoutUser } from './auth.js';

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
    const desktopDarkButton = document.getElementById("darkModeToggleButton");
    const mobileDarkButton = document.getElementById("menuDarkModeButton");
    if (!desktopDarkButton && !mobileDarkButton) return;

    const applyThemeState = (isDark, animateDesktopIcon = false) => {
        document.body.classList.toggle("dark-theme", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");

        if (desktopDarkButton) {
            const icon = desktopDarkButton.querySelector("i");
            desktopDarkButton.setAttribute("aria-pressed", String(isDark));
            desktopDarkButton.title = isDark ? "Activar modo claro" : "Activar modo oscuro";
            if (icon) {
                icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
            }

            if (animateDesktopIcon) {
                desktopDarkButton.classList.remove("is-animating");
                void desktopDarkButton.offsetWidth;
                desktopDarkButton.classList.add("is-animating");
                setTimeout(() => desktopDarkButton.classList.remove("is-animating"), 380);
            }
        }

        if (mobileDarkButton) {
            mobileDarkButton.setAttribute("aria-pressed", String(isDark));
            mobileDarkButton.classList.toggle("is-active", isDark);
            mobileDarkButton.textContent = isDark ? "Light mode" : "Dark mode";
        }
    };

    if (desktopDarkButton) {
        desktopDarkButton.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark-theme");
            applyThemeState(isDark, true);
        });
    }

    if (mobileDarkButton) {
        mobileDarkButton.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark-theme");
            applyThemeState(isDark, true);
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

// ============================================================================================
//                         MANEJA EL ESTADO DE SESIÓN (LOGIN/LOGOUT)
// ============================================================================================
export function initAuthState() {
    const user = getCurrentUser();
    const desktopAuth = document.querySelector(".auth-links");
    const mobileAuth = document.querySelector(".menu-mobile-actions");

    if (user) {
        const userName = user.name || user.email.split('@')[0];
        const loggedInHtml = `
            <span class="user-greeting" style="margin-right: 15px; font-weight: 500; color: inherit;">Hola, ${userName}</span>
            <a href="#" class="auth-link-logout" style="cursor: pointer;">Logout</a>
        `;
        
        if (desktopAuth) {
            desktopAuth.innerHTML = loggedInHtml;
        }

        if (mobileAuth) {
            const darkModeBtn = mobileAuth.querySelector(".menu-dark-toggle");
            mobileAuth.innerHTML = '';
            if (darkModeBtn) mobileAuth.appendChild(darkModeBtn);
            mobileAuth.insertAdjacentHTML('beforeend', loggedInHtml);
        }

        document.querySelectorAll(".auth-link-logout").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                logoutUser();
                window.location.reload();
            });
        });
    }
}
