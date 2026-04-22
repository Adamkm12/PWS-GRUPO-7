# Hotel Boutique - Angular 20 + Firebase

Proyecto web de un hotel desarrollado con Angular 20 y Firebase (Authentication + Firestore).
Continuacion del Sprint 2 del Grupo 7, migrando la arquitectura de HTML/CSS/JS vanilla a un
framework moderno con base de datos en la nube.

---

## Requisitos previos

- **Node.js >= 20.11.1** (recomendado: 20.18.x LTS o 22.x LTS)
  Descargar desde: https://nodejs.org
- **npm >= 9**
- **Angular CLI 20**

### Instalar Angular CLI

```bash
npm install -g @angular/cli@20
```

---

## Configuracion de Firebase

### 1. Crear el proyecto

1. Ir a https://console.firebase.google.com
2. Crear un nuevo proyecto

### 2. Activar Authentication

1. Ir a **Authentication > Sign-in method**
2. Habilitar **Email/Password**

### 3. Activar Firestore

1. Ir a **Firestore Database > Crear base de datos**
2. Seleccionar modo prueba o produccion
3. Elegir region (recomendado: `europe-west1`)

### 4. Obtener credenciales

1. Ir a **Configuracion del proyecto > Tus aplicaciones > Agregar app > Web**
2. Copiar el objeto `firebaseConfig`

### 5. Configurar el entorno

Editar `src/environments/environment.ts` con tus valores:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_PROJECT_ID.firebaseapp.com',
    projectId: 'TU_PROJECT_ID',
    storageBucket: 'TU_PROJECT_ID.appspot.com',
    messagingSenderId: 'TU_MESSAGING_SENDER_ID',
    appId: 'TU_APP_ID'
  }
};
```

### 6. Reglas de Firestore recomendadas

En **Firestore > Reglas**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## Instalacion y ejecucion

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
ng serve
```

La aplicacion estara disponible en http://localhost:4200

```bash
# Compilar para produccion
ng build
```

---

## Estructura del proyecto

```
hotel-luxe-v20/
|
+-- src/
|   +-- app/
|   |   +-- components/
|   |   |   +-- header/        -> Cabecera con nav, dark mode y auth
|   |   |   +-- footer/        -> Pie de pagina con modal de contacto
|   |   |
|   |   +-- pages/
|   |   |   +-- home/          -> Pagina principal con buscador de fechas
|   |   |   +-- accommodations/-> Habitaciones con reserva a Firestore
|   |   |   +-- services/      -> Servicios del hotel
|   |   |   +-- gallery/       -> Galeria fotografica
|   |   |   +-- login/         -> Inicio de sesion con Firebase Auth
|   |   |   +-- register/      -> Registro de nueva cuenta
|   |   |   +-- my-bookings/   -> Reservas del usuario (ruta protegida)
|   |   |
|   |   +-- services/
|   |   |   +-- auth.ts        -> Registro, login y logout
|   |   |   +-- booking.ts     -> CRUD de reservas en Firestore
|   |   |   +-- theme.ts       -> Dark mode con localStorage
|   |   |
|   |   +-- guards/
|   |   |   +-- auth-guard.ts  -> Protege /my-bookings sin sesion
|   |   |
|   |   +-- app.routes.ts      -> Rutas con lazy loading
|   |   +-- app.config.ts      -> Firebase providers
|   |   +-- app.ts             -> Componente raiz
|   |
|   +-- environments/
|   |   +-- environment.ts     -> Credenciales Firebase (no subir a git)
|   |
|   +-- styles.scss            -> Estilos globales y dark mode
|
+-- public/
|   +-- assets/images/         -> Imagenes del hotel
|
+-- README.md
+-- package.json
```

---

## Paginas disponibles

| Ruta              | Descripcion                                  | Protegida |
|-------------------|----------------------------------------------|-----------|
| `/home`           | Pagina principal con buscador de estancias   | No        |
| `/accommodations` | Listado de habitaciones con reserva          | No        |
| `/services`       | Servicios del hotel                          | No        |
| `/gallery`        | Galeria fotografica                          | No        |
| `/login`          | Inicio de sesion con Firebase Auth           | No        |
| `/register`       | Registro de nueva cuenta                     | No        |
| `/my-bookings`    | Reservas del usuario autenticado             | Si        |

---

## Funcionalidades

- Buscador de fechas y ocupacion en la pagina principal
- Listado de habitaciones con precio por noche y precio total segun fechas
- Validacion de estancia minima de 3 noches al reservar
- Reservas guardadas en Firestore asociadas al usuario
- Registro e inicio de sesion con Firebase Authentication
- Ruta `/my-bookings` protegida, redirige a `/login` si no hay sesion
- Dark mode activable desde el header, persistido en localStorage
- Menu lateral responsive en dispositivos moviles

---

## Notas sobre versiones

- Angular 20 cambia la convencion de nombres: los archivos ya no llevan
  el sufijo `.component` ni `.service`. Por ejemplo, `header.ts` en lugar
  de `header.component.ts`.
- `@angular/fire@20` es compatible con `firebase@^12`.
- Node.js minimo requerido: `20.11.1`. Se recomienda usar `20.18.x LTS`
  o la version `22.x LTS`.

---

## Participantes

Adam Kardouchi Mhaifid
Pablo Damas Negrin
Cristian Tomas Vega Appelqvist
