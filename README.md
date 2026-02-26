# PWM-GRUPO-7 - Web de Hotel

Participantes:\
Adam Kardouchi Mhaifid\
Pablo Damas Negrín\
Cristian Tomás Vega Appelqvist

1. Descripción general\
   Se va a desarrollar un sitio web funcional para un hotel, cuyo objetivo es poder ofrecer información
   sobre el hotel, sus habitaciones y servicios, así como facilitar la reserva de las habitaciones deseadas.


2. Requisitos funcionales\
   RF1 - Home: El sitio web contará con una página principal con información general del hotel.\
   RF2 - Acomodaciones: El usuario podrá acceder al listado de las habitaciones.\
   RF3 - Detalles:  El usuario podrá acceder al detalle de una habitación.\
   RF4 - Servicios: El sitio web dispondrá de una página de servicios del hotel.\
   RF5 - Información de contacto: El usuario dispondrá de un botón para contactar con el hotel.\
   RF6 - Cabecera común: El usuario podrá navegar entre las páginas mediante un menú común.\
   RF7 - Apartado fotográfico: El usuario podrá acceder a un álbum de fotos del hotel.\
   RF8 - Dark Mode: El sitio web contará con un modo oscuro.\
   RF9 - Estancia mínima: Reserva mínima de tres noches.\
   RF10 - Sistema de reservas: El usuario podrá elegir la fecha de entrada/salida, el número de personas y el tipo de habitación.\
   RF11 - Confirmación de reserva: El usuario recibirá una confirmación cuando la reserva se haya completado correctamente.\
   RF12 - Redes sociales: El usuario podrá acceder a las redes sociales del hotel


3. Mockups y Storyboard\
   Enlace al figma con los Mockups: https://www.figma.com/site/KzcIXIZpLfRPtvjqmQTwbA/SPRINT_1?node-id=0-1&p=f&t=SLl2UPEHGe8mqERo-0 \
   O PDF en la carpeta principal: PWS-GRUPO-7/Mockups.pdf


4. Listado de páginas HTML\
   Página de inicio: PWS-GRUPO-7/pages/home.html\
   Galeria -> PWS-GRUPO-7/pages/gallery.html\
   Servicios del hotel -> PWS-GRUPO-7/pages/services.html\
   Creacion cuenta -> PWS-GRUPO-7/pages/register.html\
   Iniciar Sesión -> PWS-GRUPO-7/pages/logIn.html\
   Reservas -> PWS-GRUPO-7/pages/mybookings.html\
   Acomodaciones -> PWS-GRUPO-7/pages/accommodations.html\


5. Listado de templates y su descripcion\
   Están en PWS-GRUPO-7/templates/partials/ \
   mainHeader.html -> Es el header de todas las páginas menos de accommodations\
   bookingHeader.html -> Es el header de accommodations\
   mainFooter -> Es el footer de todas las páginas.\
   cardsList -> Muestra la habitación en accommodations\
   mainServices -> Muestra un servicio, lo usan restaurant.html y casino.html\
   userBookings -> Muestra una reserva del usuario, es llamado en mybookings.html\
   extraServices -> Muestra cada servicio poco detallado en services.html


6. Otros listados\
   Los archivos CSS se encuentran en: PWS-GRUPO-7/assets/css/, con sus nombres idénticos a sus debidas páginas en las que son llamadas \
   Los archivos JS se encuentran en: PWS-GRUPO-7/assets/js/modules/ \
   Los iconos se encuentran en: PWS-GRUPO-7/assets/icons/, como los logos de las redes sociales o el del hotel \
   El resto de imágenes usadas se encuentran en PWS-GRUPO-7/assets/images/

## Estructura del Proyecto


PWS-GRUPO-7/\
│\
├── assets/\
│   ├── css/        → Hojas de estilo\
│   ├── icons/      → Recursos gráficos (iconografía)\
│   ├── images/     → Imágenes del sitio\
│   └── js/         → Scripts JavaScript\
│\
├── pages/          → Vistas principales del sistema\
│   ├── home.html\
│   ├── accommodations.html\
│   ├── restaurant.html\
│   ├── casino.html\
│   ├── services.html\
│   ├── album.html\
│   ├── booking.html\
│   ├── myBookings.html\
│   ├── login.html\
│   └── register.html\
│\
├── templates/\
│   └── partials/   → Componentes reutilizables\
│       ├── mainHeader.html\
│       ├── bookingHeader.html\
│       ├── mainFooter.html\
│       ├── cardsList.html\
│       ├── mainServices.html\
│       ├── userBookings.html\
│       └── extraServices.html\
│\
├── .gitignore\
├── Mockups.pdf\
└── README.md
