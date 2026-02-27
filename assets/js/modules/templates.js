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

  const response = await fetch("../templates/partials/cardsList.html");
  if (!response.ok) {
    throw new Error(`Error cargando cards template: ${response.status}`);
  }

  const cardTemplate = await response.text();
  cardsContainer.innerHTML = cardTemplate.repeat(3);
}

async function loadNotMainServices() {
  const servicesContainer = document.getElementById("not-main-services-container");

  if (!servicesContainer) {
    return;
  }

  const response = await fetch("../templates/partials/extraServices.html");
  if (!response.ok) {
    throw new Error(`Error cargando services template: ${response.status}`);
  }

  const templateMarkup = await response.text();
  const parserHost = document.createElement("div");
  parserHost.innerHTML = templateMarkup;

  const serviceTemplate = parserHost.querySelector("#service-item-template");
  if (!serviceTemplate) {
    throw new Error("No se encontro #service-item-template en extraServices.html");
  }

  const servicesData = [
    {
      title: "Spa Ritual & Wellness",
      description:
        "Tratamientos relajantes con cabinas privadas, circuito termal y zona de descanso pensada para desconectar.",
      time: "Horario servicio: 08:00 - 22:00",
      image: "../assets/images/room.jpg",
      alt: "Servicio de spa",
    },
    {
      title: "Sky Lounge Privado",
      description:
        "Espacio exclusivo con cocteleria de autor, vistas panoramicas y ambiente ideal para encuentros nocturnos.",
      time: "Horario servicio: 12:00 - 01:00",
      image: "../assets/images/casino.jpg",
      alt: "Servicio de lounge",
    },
    {
      title: "Chef Table Experience",
      description:
        "Menu degustacion preparado al momento por nuestro chef, con maridajes seleccionados y atencion personalizada.",
      time: "Horario servicio: 19:00 - 23:30",
      image: "../assets/images/retaurant.jpg",
      alt: "Servicio gourmet",
    },
    {
      title: "Transfer Premium",
      description:
        "Traslados privados desde y hacia puntos clave de la ciudad, con reserva anticipada y seguimiento en tiempo real.",
      time: "Horario servicio: 24 horas",
      image: "../assets/images/photoHome.jpg",
      alt: "Servicio transfer",
    },
    {
      title: "Concierge Signature",
      description:
        "Asistencia personalizada para reservas, recomendaciones locales y coordinacion de experiencias a medida.",
      time: "Horario servicio: 09:00 - 21:00",
      image: "../assets/images/poolHotel.png",
      alt: "Servicio concierge",
    },
  ];

  servicesContainer.innerHTML = "";

  servicesData.forEach((service) => {
    const item = serviceTemplate.content.cloneNode(true);

    const image = item.querySelector(".service-image");
    const name = item.querySelector(".service-name");
    const description = item.querySelector(".service-description");
    const time = item.querySelector(".service-time");

    if (image) {
      image.src = service.image;
      image.alt = service.alt;
    }
    if (name) {
      name.textContent = service.title;
    }
    if (description) {
      description.textContent = service.description;
    }
    if (time) {
      time.textContent = service.time;
    }

    servicesContainer.appendChild(item);
  });
}

async function loadMyBookings() {
  const bookingsContainer = document.getElementById("mybookings-container");

  if (!bookingsContainer) {
    return;
  }

  const response = await fetch("../templates/partials/userBookings.html");
  if (!response.ok) {
    throw new Error(`Error cargando myBookings template: ${response.status}`);
  }

  const templateMarkup = await response.text();
  const parserHost = document.createElement("div");
  parserHost.innerHTML = templateMarkup;

  const emptyTemplate = parserHost.querySelector("#my-bookings-empty-template");
  const bookingTemplate = parserHost.querySelector("#my-booking-item-template");

  if (!emptyTemplate || !bookingTemplate) {
    throw new Error("No se encontraron los templates de userBookings.html");
  }

  const bookingsData = [
    {
      room: "Suite Deluxe",
      dates: "Check-in: 12/03/2026 | Check-out: 15/03/2026",
      guests: "Huespedes: 2 adultos",
      status: "Estado: Confirmada",
    },
    {
      room: "Junior Suite",
      dates: "Check-in: 28/04/2026 | Check-out: 01/05/2026",
      guests: "Huespedes: 1 adulto",
      status: "Estado: Pendiente de pago",
    },
  ];

  bookingsContainer.innerHTML = "";

  if (!bookingsData.length) {
    bookingsContainer.appendChild(emptyTemplate.content.cloneNode(true));
    return;
  }

  bookingsData.forEach((booking) => {
    const item = bookingTemplate.content.cloneNode(true);

    const room = item.querySelector(".booking-room");
    const dates = item.querySelector(".booking-dates");
    const guests = item.querySelector(".booking-guests");
    const status = item.querySelector(".booking-status");

    if (room) {
      room.textContent = booking.room;
    }
    if (dates) {
      dates.textContent = booking.dates;
    }
    if (guests) {
      guests.textContent = booking.guests;
    }
    if (status) {
      status.textContent = booking.status;
    }

    bookingsContainer.appendChild(item);
  });
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
      loadPartial("footer-template", "../templates/partials/mainFooter.html"),
      loadPartial("main-services-template", "../templates/partials/mainServices.html"),
      loadPartial("booking-header-template", "../templates/partials/bookingHeader.html"),
    ]);

    initMainServicesTemplate();

    if (window.initStickyHeader) {
      window.initStickyHeader(".load-header");
    }

    await loadCards();
    await loadNotMainServices();
    await loadMyBookings();
  } catch (error) {
    console.error("No se pudieron cargar los templates:", error);
  }
});
