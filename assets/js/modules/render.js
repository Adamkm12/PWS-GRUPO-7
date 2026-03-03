import { servicesData, bookingsData } from './data.js';


// ============================================================================================
//                               CARGA LOS SERVICIOS DISPONIBLES
// ============================================================================================
export async function renderServices() {
    const container = document.getElementById("not-main-services-container");
    if (!container) return;

    const response = await fetch("../templates/partials/extraServices.html");
    const html = await response.text();
    const template = new DOMParser().parseFromString(html, 'text/html').querySelector('#service-item-template');

    container.innerHTML = "";
    servicesData.forEach((service, index) => {
        const clone = template.content.cloneNode(true);
        const art = clone.querySelector(".service-item");

        art.classList.add("reveal");
        art.style.animationDelay = `${index * 0.15}s`;

        clone.querySelector(".service-image").src = service.image;
        clone.querySelector(".service-name").textContent = service.title;
        clone.querySelector(".service-description").textContent = service.description;
        clone.querySelector(".service-time").textContent = service.time;

        container.appendChild(clone);
    });
}

// ============================================================================================
//                               CARGA LAS RESERVAS DISPONIBLES
// ============================================================================================
export async function renderBookings() {
    const container = document.getElementById("mybookings-container");
    if (!container) return;

    const response = await fetch("../templates/partials/userBookings.html");
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const itemTemplate = doc.querySelector("#my-booking-item-template");

    container.innerHTML = "";
    bookingsData.forEach((booking, index) => {
        const clone = itemTemplate.content.cloneNode(true);
        const art = clone.querySelector(".booking-item");

        art.classList.add("reveal");
        art.style.animationDelay = `${index * 0.15}s`;

        clone.querySelector(".booking-room").textContent = booking.room;
        clone.querySelector(".booking-dates").textContent = booking.dates;
        clone.querySelector(".booking-status").textContent = booking.status;

        container.appendChild(clone);
    });
}
