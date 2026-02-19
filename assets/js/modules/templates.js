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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await Promise.all([
      loadPartial("header-template", "../templates/partials/header.html"),
      loadPartial("footer-template", "../templates/partials/footer.html"),
    ]);

    if (window.initStickyHeader) {
      window.initStickyHeader(".load-header");
    }

    await loadCards();
  } catch (error) {
    console.error("No se pudieron cargar los templates:", error);
  }
});
