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
    if (!toggle) return;

    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
        toggle.checked = true;
        document.body.classList.add("dark-theme");

    }
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