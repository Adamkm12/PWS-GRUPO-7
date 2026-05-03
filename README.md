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
