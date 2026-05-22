# Hotel Luxe - App Ionic (Sprint 4)

App móvil desarrollada con **Ionic + Angular** para el Sprint 4. Implementa autenticación con Firebase, visualización de habitaciones desde Firestore y gestión de favoritos con SQLite.

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| **Ionic 8 + Angular 18** | Framework móvil (UI + lógica) |
| **Firebase Authentication** | Registro y login de usuarios |
| **Firebase Firestore** | Colección de habitaciones en la nube |
| **Capacitor SQLite** | Favoritos almacenados localmente |

## Las 4 pantallas

### 1. Registro (`/register`)
- Formulario con: nombre, apellidos, email, contraseña, foto (URL)
- Crea usuario en Firebase Auth
- Guarda perfil en Firestore (colección `users`)

### 2. Login (`/login`)
- Formulario email + contraseña
- Autenticación contra Firebase Authentication

### 3. Favoritos (`/favorites`) — protegida
- Lista todas las habitaciones de Firestore (`rooms`)
- Marca visualmente las favoritas (ícono ⭐) — datos de SQLite
- Navegación al detalle al pulsar cualquier habitación

### 4. Detalle (`/detail/:id`) — protegida
- Muestra información completa de la habitación (Firestore)
- Imagen característica obligatoria
- Botón FAB para añadir/quitar de favoritos (SQLite)

## Instalación y ejecución

```bash
# 1. Entrar a la carpeta del proyecto
cd ionic-app

# 2. Instalar dependencias
npm install

# 3. Ejecutar en el navegador (con fallback localStorage para SQLite)
npx ng serve
# → Abrir http://localhost:4200

# 4. Para compilar para Android/iOS (requiere Capacitor)
npx ng build
npx cap sync
npx cap open android   # Abre Android Studio
```

## Estructura de ficheros

```
ionic-app/
├── capacitor.config.ts          # Configuración Capacitor (SQLite nativo)
├── ionic.config.json            # Configuración Ionic CLI
├── src/
│   ├── index.html               # Entrada HTML (carga jeep-sqlite para web)
│   ├── main.ts                  # Bootstrap Angular
│   ├── global.scss              # Estilos globales Ionic
│   ├── theme/variables.scss     # Variables de color (tema Hotel Luxe)
│   └── app/
│       ├── app.component.ts     # Raíz: inicia SQLite + seed Firestore
│       ├── app.config.ts        # Providers: Ionic, Firebase, Router
│       ├── app.routes.ts        # Rutas con authGuard en favoritos/detalle
│       ├── environments/
│       │   └── environment.ts   # Config Firebase (misma que Angular web)
│       ├── models/
│       │   └── room.model.ts    # Interfaces: Room, UserProfile, Favorite
│       ├── services/
│       │   ├── auth.service.ts  # Firebase Auth + perfil en Firestore
│       │   ├── rooms.service.ts # Colección "rooms" de Firestore
│       │   └── sqlite.service.ts# SQLite nativo + fallback localStorage
│       ├── guards/
│       │   └── auth.guard.ts    # Protege /favorites y /detail/:id
│       └── pages/
│           ├── login/           # Pantalla 2: autenticación
│           ├── register/        # Pantalla 1: registro con perfil
│           ├── favorites/       # Pantalla 3: lista + favoritos (SQLite)
│           └── detail/          # Pantalla 4: detalle + toggle favorito
```

## Esquema SQLite

```sql
CREATE TABLE IF NOT EXISTS favorites (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  roomId  TEXT NOT NULL,
  userId  TEXT NOT NULL,
  addedAt TEXT NOT NULL,
  UNIQUE(roomId, userId)
);
```

## Firebase (Firestore)

- **Colección `rooms`**: habitaciones del hotel (seeded automáticamente al iniciar)
- **Colección `users`**: perfiles de usuario (uid, email, nombre, apellidos, fotoUrl)
