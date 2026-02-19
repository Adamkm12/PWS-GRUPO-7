function initStickyHeader(selector = ".load-header") {
    const header = document.querySelector(selector) || document.querySelector(".header");

    if (!header || header.dataset.stickyInit === "true") {
        return;
    }

    header.dataset.stickyInit = "true";

    const body = document.body;
    let stickyHeight = header.offsetHeight;

    const updateSticky = () => {
        const isSticky = window.scrollY > stickyHeight;
        header.classList.toggle("is-sticky", isSticky);
        body.classList.toggle("has-sticky-header", isSticky);
    };

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

window.initStickyHeader = initStickyHeader;
