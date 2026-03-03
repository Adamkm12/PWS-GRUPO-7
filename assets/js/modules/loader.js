// ============================================================================================
//                               PERMITE CARGAR LOS TEMPLATES (HTML)
// ============================================================================================

export async function loadPartial(containerId, partialPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const response = await fetch(partialPath);
    if (!response.ok) throw new Error(`Error cargando ${partialPath}`);

    container.innerHTML = await response.text();
}

// ============================================================================================
//                                      CARGA LAS HABITACIONES
// ============================================================================================
export async function loadCards() {
    const container = document.getElementById("cards-container");
    if (!container) return;

    const response = await fetch("../templates/partials/cardsList.html");
    const cardTemplate = await response.text();
    container.innerHTML = cardTemplate.repeat(3);
}
