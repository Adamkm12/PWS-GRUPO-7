# 🏨 Hotel Luxe — Aplicación Web (Sprint 3)

> Proyecto universitario — Grupo 7 · PWS · Sprint 3

Aplicación web para la gestión y reserva de habitaciones de un hotel de lujo, desarrollada con **Angular 20** e integrada con **Firebase** (Authentication + Firestore).

---

## 📋 Índice

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Páginas y rutas](#páginas-y-rutas)
- [Funcionalidades principales](#funcionalidades-principales)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Scripts disponibles](#scripts-disponibles)
- [Equipo](#equipo)

---

## Descripción

Hotel Luxe es una SPA (Single Page Application) que simula el sitio web oficial de un hotel de lujo. Permite a los usuarios explorar habitaciones, consultar servicios, ver la galería y realizar reservas completas. Las reservas quedan persistidas en **Cloud Firestore** y sólo son accesibles una vez autenticado el usuario.

---

## Tecnologías

- **Angular 20** — Framework principal de la aplicación.
- **Firebase** — Autenticación de usuarios (Firebase Auth) y base de datos en tiempo real (Cloud Firestore).
- **TypeScript** — Lenguaje principal con tipado estático.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Barra de navegación
│   │   ├── footer/          # Pie de página
│   │   └── toast/           # Notificaciones emergentes
│   ├── guards/
│   │   └── auth-guard.ts    # Protección de rutas privadas
│   ├── pages/
│   │   ├── home/            # Página principal con buscador
│   │   ├── accommodations/  # Catálogo de habitaciones
│   │   ├── booking/         # Proceso de reserva (5 pasos)
│   │   ├── services/        # Servicios del hotel
│   │   ├── gallery/         # Galería fotográfica
│   │   ├── about/           # Información del hotel
│   │   ├── contact/         # Formulario de contacto
│   │   ├── login/           # Inicio de sesión
│   │   ├── register/        # Registro de usuario
│   │   └── my-bookings/     # Mis reservas (privado)
│   ├── services/
│   │   ├── auth.ts          # Autenticación Firebase
│   │   ├── booking.ts       # CRUD de reservas en Firestore
│   │   ├── theme.ts         # Modo claro / oscuro
│   │   └── toast.ts         # Servicio de notificaciones
│   ├── environments/        # Variables de entorno
│   └── app.routes.ts        # Definición de rutas
public/
└── assets/images/           # Imágenes estáticas del hotel
```

---

## Componentes y su funcionalidad

### Componentes compartidos

**`Header`**
Barra de navegación presente en todas las páginas. Se suscribe reactivamente al estado de autenticación para mostrar el nombre del usuario o los enlaces de login/registro según corresponda. Incluye un menú hamburguesa para móvil (con bloqueo del scroll del body mientras está abierto), el botón de alternancia de tema claro/oscuro y el botón de cierre de sesión, que redirige a `/home` tras hacer logout.

**`Footer`**
Pie de página con enlaces de navegación secundarios. Gestiona la apertura y cierre de un modal de información legal (política de privacidad / aviso legal) que se cierra tanto con el botón de cerrar como al hacer clic fuera del modal.

**`Toast`**
Componente de notificaciones emergentes. Se inyecta en el layout raíz y escucha el `ToastService` para mostrar mensajes de tipo `success`, `error`, `warning` e `info`, cada uno con su icono correspondiente de Bootstrap Icons. Permite descartar cada notificación individualmente.

---

### Páginas

**`Home`**
Página de inicio con un buscador de disponibilidad. Inicializa las fechas por defecto (hoy como check-in, hoy + 3 días como check-out) y permite seleccionar adultos y niños mediante controles incrementales. Al pulsar "Buscar", navega a `/booking` pasando los parámetros de búsqueda como query params.

**`Accommodations`**
Catálogo de habitaciones disponibles. Recibe los parámetros de búsqueda del Home por query params y los usa para calcular el número de noches y el precio total de cada habitación. Usa `IntersectionObserver` para activar animaciones de entrada al hacer scroll. Valida que la estancia sea de al menos 3 noches antes de crear la reserva directamente en Firestore a través del `BookingService`.

**`Booking`**
Flujo de reserva dividido en 5 pasos:
1. **Fechas y ocupantes** — selección de check-in, check-out, adultos y niños. Requiere mínimo 3 noches para avanzar.
2. **Habitación** — elección entre las 3 opciones disponibles. Valida que la capacidad de la habitación sea suficiente para el número de huéspedes.
3. **Extras** — selección de servicios adicionales (desayuno, media pensión, traslado, spa, parking, late check-out).
4. **Datos del huésped** — formulario con nombre, email, teléfono, peticiones especiales y método de pago (tarjeta, transferencia o PayPal). Si se selecciona tarjeta, valida el número, nombre, caducidad y CVV.
5. **Confirmación** — resumen completo con desglose de precios (habitación + extras + 10% de impuestos). Al confirmar, guarda la reserva en Firestore y redirige a `/my-bookings` resaltando la reserva recién creada.

La barra de progreso superior refleja el avance real según los pasos completados, impidiendo saltar a pasos no desbloqueados.

**`MyBookings`**
Panel privado del usuario autenticado. Carga todas sus reservas desde Firestore y permite filtrarlas por estado: todas, activas, pasadas y canceladas. Muestra un resumen estadístico con el total gastado y las noches reservadas. Cada reserva es expandible para ver el detalle completo. Permite cancelar reservas futuras confirmadas (cambia el estado a `Cancelada` en Firestore) y resalta automáticamente la reserva recién creada si llega el parámetro `highlight` en la URL.

**`Contact`**
Página de contacto con dos secciones: un formulario (nombre, email, teléfono, asunto y mensaje) que simula el envío mostrando un toast de confirmación, y una sección de preguntas frecuentes con acordeón (check-in, mascotas, parking, política de cancelación).

**`Login`**
Formulario de inicio de sesión con email y contraseña. Llama a `AuthService.login()` y redirige a `/home` si tiene éxito, o muestra un mensaje de error si las credenciales son incorrectas.

**`Register`**
Formulario de registro con nombre, apellido, email, teléfono, país, fecha de nacimiento, contraseña y confirmación. Valida que las contraseñas coincidan y que se acepten los términos. Llama a `AuthService.register()` con el nombre completo como `displayName`. Redirige a `/home` tras el registro exitoso.

**`Services`**, **`Gallery`**, **`About`**
Páginas informativas estáticas que muestran los servicios del hotel, la galería fotográfica y la información corporativa respectivamente.

---

## Páginas y rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/home` | Home | Público |
| `/accommodations` | Accommodations | Público |
| `/booking` | Booking | Público |
| `/services` | Services | Público |
| `/gallery` | Gallery | Público |
| `/about` | About | Público |
| `/contact` | Contact | Público |
| `/login` | Login | Público |
| `/register` | Register | Público |
| `/my-bookings` | MyBookings | **Privado** (requiere login) |

Todas las rutas desconocidas redirigen a `/home`.

---

## Funcionalidades principales

### 🔐 Autenticación
- Registro de nuevos usuarios con nombre, email y contraseña.
- Inicio de sesión con email y contraseña.
- Cierre de sesión.
- Observación reactiva del estado de autenticación mediante `user()` de Firebase.

### 📅 Proceso de reserva (5 pasos)
1. Selección de fechas y ocupantes.
2. Elección de habitación.
3. Selección de extras (desayuno, traslado, spa, parking…).
4. Datos del huésped y método de pago (tarjeta / transferencia / PayPal).
5. Confirmación y resumen de la reserva.

La estancia mínima es de **3 noches**. El precio total se calcula como: `(precio/noche × noches) + (precio extras × noches)`.

### 📂 Mis reservas
- Listado de todas las reservas del usuario autenticado, ordenadas por fecha de creación.
- Cancelación de reservas (cambia el estado a `Cancelada`).
- Eliminación definitiva de reservas.
- Ruta protegida por `authGuard`: redirige a `/login` si no hay sesión activa.

### 🔔 Notificaciones toast
- Sistema de notificaciones emergentes para confirmaciones y errores.

---

## Instalación y ejecución

### Prerrequisitos

- Node.js ≥ 18
- Angular CLI ≥ 20

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd PWS-GRUPO-7-SPRINT-3-TEMP

# 2. Instalar dependencias
npm install

# 3. Configurar Firebase
# Edita src/app/environments/environment.ts con tus credenciales de Firebase:
# apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId

# 4. Arrancar el servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Servidor de desarrollo (`ng serve`) |
| `npm run build` | Compilación para producción |
| `npm run watch` | Compilación en modo observación |
| `npm test` | Ejecución de tests unitarios (Karma) |

---

## Equipo

Proyecto desarrollado por el **Grupo 7** en el marco de la asignatura de Programación Web del lado del Servidor (PWS) — Sprint 3.
