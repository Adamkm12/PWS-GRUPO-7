async function loadPartial(containerId, partialPath) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  const response = await fetch(partialPath);
  if (!response.ok) {
    throw new Error(`Error cargando ${partialPath}: ${response.status}`);
  }

  container.innerHTML = await response.text();
}

async function loadCards() {
  const cardsContainer = document.getElementById("cards-container");

  if (!cardsContainer) {
    return;
  }

  const response = await fetch("../templates/partials/cards.html");
  if (!response.ok) {
    throw new Error(`Error cargando cards template: ${response.status}`);
  }

  const cardTemplate = await response.text();
  cardsContainer.innerHTML = cardTemplate.repeat(3);
}

function initMainServicesTemplate() {
  const body = document.body;
  const title = document.getElementById("service-title");
  const subtitle = document.getElementById("service-subtitle");
  const description = document.getElementById("service-description");
  const hero = document.getElementById("service-hero");

  if (!title || !subtitle || !description || !hero) {
    return;
  }

  title.textContent = body.dataset.serviceTitle || "";
  subtitle.textContent = body.dataset.serviceSubtitle || "";
  description.textContent = body.dataset.serviceDescription || "";

  const heroLabel = body.dataset.serviceHeroLabel;
  if (heroLabel) {
    hero.setAttribute("aria-label", heroLabel);
  }

  const heroImage = body.dataset.serviceHeroImage;
  if (heroImage) {
    const isElegant = body.dataset.serviceStyle === "elegant";
    hero.style.backgroundImage = isElegant
      ? `url("${heroImage}")`
      : `linear-gradient(135deg, rgba(239, 237, 233, 0.2) 0%, rgba(228, 223, 216, 0.2) 100%), url("${heroImage}")`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await Promise.all([
      loadPartial("header-template", "../templates/partials/header.html"),
      loadPartial("footer-template", "../templates/partials/footer.html"),
      loadPartial("header-template-booking", "../templates/partials/header_booking.html"),
      loadPartial("main-services-template", "../templates/partials/mainServices.html"),
    ]);

    initMainServicesTemplate();

    if (window.initStickyHeader) {
      window.initStickyHeader(".load-header");
    }

    await loadCards();
  } catch (error) {
    console.error("No se pudieron cargar los templates:", error);
  }
});
